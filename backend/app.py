import datetime
from flask import Flask, request, jsonify, make_response, session
from sqlalchemy import extract, func
from flask_cors import CORS
import uuid

from sqlalchemy_utils import database_exists, create_database

from receipt import Receipt # this is a class, not a db model :)

from doc_intel_quickstart import analyze_receipts
import json
from azure.core.exceptions import HttpResponseError
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from datetime import datetime, date, time, timedelta
from model import db, Receipt as ReceiptModel, Item, Stores, User

from dotenv import load_dotenv
import os


load_dotenv()

sessions = {}


app = Flask(__name__)
app.secret_key = os.getenv("SESSION_KEY") # for sessions

cors = CORS(app)

# SQLAlchemy connection string using SSL
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv('UTI')

# 'sqlite:///bagel.db' 

app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False



db.init_app(app) # instead of passing 'app' to db = SQLAlchemy(app) in model.py





@app.cli.command('initdb')
def initdb_command():
    with app.app_context():
        db.drop_all()
        db.create_all()  # creates table for all defined models
        print('Initialized the database.')


@app.route('/start-upload-session', methods=["POST"])
def start_session():
    session_id = str(uuid.uuid4())
    sessions[session_id] = {'received': 0, 'total': request.json['total']}
    return jsonify({'session_id': session_id})


@app.route('/upload-image/<session_id>/<index>', methods=['POST'])
def upload_image(session_id, index):

    receipt = None
    if session_id not in sessions:
        print("in session")
        return jsonify({'error': 'Invalid session ID'}), 400

    image_data = request.data
    if not image_data:
        return jsonify({'error': 'No image data received'}), 400

    # Initialize a list to store images if not already done
    if 'images' not in sessions[session_id]:
        sessions[session_id]['images'] = []

    # Add the current image to the session
    sessions[session_id]['images'].append(image_data)
    sessions[session_id]['received'] += 1

    # Check if all images are received
    if sessions[session_id]['received'] == sessions[session_id]['total']:
        # Process all images for this session
        receipt = process_images(session_id)

        # Optionally, clear the images from the session to free up memory
        del sessions[session_id]['images']
    else:
        return jsonify({'message': f'Received {sessions[session_id]["received"]} of {sessions[session_id]["total"]} images'}), 202

    return jsonify(receipt.to_dict()), 201

def process_images(session_id):
    images = sessions[session_id]['images']
    new_receipt = Receipt()
    for image in images:
        analyze(image, new_receipt)

    print(new_receipt)


    return new_receipt


@app.route('/add-to-db', methods=['POST'])
def add_receipt_to_db():

    current_user = get_current_user()
    if current_user:
        print("made it")

        receipt = request.get_json()

        date = datetime.strptime(receipt['date'], '%Y-%m-%d').date()

        items = receipt['items']
        merchant_name = receipt['merchant_name']
        pa_tax_paid = receipt['pa_tax_paid']
        subtotal = receipt['subtotal']
        total = receipt['total']
        total_tax = receipt['total_tax']

        if not merchant_name:
            merchant_name = "Store TBD"


        receipt_obj = ReceiptModel(
            merchant_name=merchant_name,
            date=date,
            subtotal =subtotal, 
            total_tax=total_tax,
            total=total, 
            pa_tax_paid=pa_tax_paid,
            user_id = current_user._id

        )
        # Add Receipt to the session
        db.session.add(receipt_obj)

        # Commit to get the receipt ID
        db.session.commit()

        for item in items:

            case_size = item['case_size']
            category = item['category']
            description = item['description']
            id_ = item['id_']
            num_oz = item['num_oz']
            price = item['price']
            quantity = item['quantity']
            total_price = item['total_price']

            # 4 48 packs of coke, 16oz cans for example
            total_ounces=None
            if category == 'tax-drink':
                total_ounces = (quantity * ( num_oz * case_size))


            new_item= Item(
                id_=id_,
                description=description,
                quantity=quantity,
                price=price,
                
                total_price=total_price,
                category=category,
                case_size=case_size,
                num_oz=num_oz,
                total_ounces=total_ounces
            )
            receipt_obj.add_item(new_item)

        db.session.add(receipt_obj)
        db.session.commit()


        return jsonify("Receipt has been added to the database"), 201
    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized

@app.route('/delete-user/<_id>', methods=['DELETE'])
def delete_user(_id):
    user = User.query.filter_by( _id = _id ).first()

    if user:
        db.session.delete(user)
        db.session.commit()
        return jsonify(message="User deleted"), 204
    else:
        return jsonify(message="User not found"), 404


@app.route("/clear/", methods=["DELETE"])
def clear_db():
    try:
        db.drop_all()
        db.create_all()
        return make_response("Database cleared successfully", 200)

    except Exception as e:
        return make_response("Failed to clear database", 500)


# can pass in an email in the url like so get-specific-months-receipts?year=${year}
# or filter for the current user in the session
@app.route('/get-user-receipts')
def get_user_receipts():
    email = request.args.get('email')

    if email:
        user = User.query.filter_by(email=email).first()
        if user:
            receipts = [receipt.to_dict() for receipt in user.receipts]
            return jsonify(receipts)
        else:
            return jsonify(message="User not found"), 404
    else:
        current_user = get_current_user()
        if current_user:
            receipts = [receipt.to_dict() for receipt in current_user.receipts]
            return jsonify(receipts)
        else:
            return jsonify(message="No email passed in and no user in session"), 400


@app.route('/delete-receipt/<_id>', methods=["DELETE"])
def delete_receipt(_id):

    receipt = ReceiptModel.query.filter_by(_id = _id).first()
    if receipt:
        db.session.delete(receipt)
        db.session.commit()
        print("Receipt deleted")
        return jsonify(message="Receipt deleted"), 204
    else:
        return jsonify(message="Receipt not found"), 404










@app.route('/get-all-users', methods=['GET'])
def get_all_users():

    all_users = User.query.all()

    if all_users:
        user_array = [user.to_dict() for user in all_users]
        return jsonify(user_array)
    else:
        return jsonify({"message": "No users found"}), 404

#DONE
@app.route('/get-receipt', methods=['GET'])
def get_receipt():
    current_user = get_current_user()
    if current_user: 
        try:
            # all_receipts = ReceiptModel.query.all()
            all_receipts = current_user.receipts
            if all_receipts:
                list_of_receipts = [receipt.to_dict() for receipt in all_receipts]
                print(json.dumps(list_of_receipts))
                return jsonify(list_of_receipts), 200  
            else:
                return make_response("No Receipts", 404) 

        except Exception as e:
            # Log the exception for debugging
            print(f"An error occurred: {e}")
            return make_response("Internal Server Error", 500)  
    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized

# gets total spend and ounces
@app.route("/get-current-months-totals",  methods=['GET'])
def get_totals():

    try:
        total_spent = get_month_total_spend()
        total_ounces = get_current_month_total_ounces() 

        return jsonify(total_spent=total_spent, total_ounces=total_ounces), 201
    except Exception as error:
        print(error)
        
        return jsonify("There was an error"), 500

#done
@app.route("/get-specific-months-receipts",  methods=['GET'])
def get_specific_months_receipts():

    current_user = get_current_user()
    if current_user: 

        year = request.args.get('year')
        month = request.args.get('month')


        ozs = get_current_month_total_ounces( year, month )


        # receipts = ReceiptModel.query.filter(
        #     extract('year', ReceiptModel.date) == year,
        #     extract('month', ReceiptModel.date) == month
        # ).all()

        receipts = ReceiptModel.query.filter(
            ReceiptModel.user_id == current_user._id,  # Assuming you have a user_id field on the Receipt model
            extract('year', ReceiptModel.date) == year,
            extract('month', ReceiptModel.date) == month
        ).all()

        return jsonify(oz=ozs, receipts=[r.to_dict() for r in receipts]), 201
    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized



def get_current_month_total_ounces(year=None, month=None):
    current_user = get_current_user()
    if current_user: 

        if year is None or month is None:
            current_year = datetime.now().year
            current_month = datetime.now().month
        else:
            current_year = year
            current_month = month


        # Query to sum the ounces for all items in receipts of the current month
        # total_ounces = db.session.query(func.sum(Item.total_ounces))\
        #                 .join(ReceiptModel, ReceiptModel._id == Item.receipt_id)\
        #                 .filter(ReceiptModel.user_id == current_user._id,  # Filter by user ID
        #                         extract('year', ReceiptModel.date) == current_year,
        #                         extract('month', ReceiptModel.date) == current_month)\
        #                 .scalar()
        # return total_ounces if total_ounces is not None else 0
            
        total_ounces_query = db.session.query(
            func.sum(Item.total_ounces)
        ).join(
            ReceiptModel, ReceiptModel._id == Item.receipt_id
        ).filter(
            ReceiptModel.user_id == current_user._id,  # Filter by user ID
            extract('year', ReceiptModel.date) == current_year,
            extract('month', ReceiptModel.date) == current_month
        )

        total_ounces = total_ounces_query.scalar() or 0

        # Query to sum the ounces for taxed items in receipts of the current month
        taxed_ounces = total_ounces_query.filter(ReceiptModel.pa_tax_paid == True).scalar() or 0

        return {
            'total_ounces': total_ounces,
            'taxed_ounces': taxed_ounces
        }

    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized

#DONE
def get_month_total_spend(year=None, month=None):
    current_user = get_current_user()
    if current_user: 
        if year is None or month is None:
            current_year = datetime.now().year
            current_month = datetime.now().month
        else:
            current_year = year
            current_month = month

        # Query to filter receipts from the specified month
        # receipts = ReceiptModel.query.filter(
        #     extract('year', ReceiptModel.date) == current_year,
        #     extract('month', ReceiptModel.date) == current_month
        # ).all()
            
        receipts = ReceiptModel.query.filter(
            ReceiptModel.user_id == current_user._id,  # Assuming you have a user_id field on the Receipt model
            extract('year', ReceiptModel.date) == current_year,
            extract('month', ReceiptModel.date) == current_month
        ).all()

        total = sum(receipt.total for receipt in receipts)
        return total

    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized

# DONE
@app.route('/get-stores', methods=["GET"])
def get_stores():

    current_user = get_current_user()

    if current_user:

        try:
            stores = current_user.stores.all()
            store_list = [store.to_dict() for store in stores ]
            print("Sending your previous store names")
            return jsonify(stores=store_list), 200
        
        except Exception as e :
            return jsonify(error_message=str(e)), 500
    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized
    
#DONE
@app.route('/add-store', methods=["POST"])
def add_new_store():

    current_user = get_current_user()
    if current_user:
        try:
            store_data = request.get_json()
            store_name = store_data['new_store']

            if store_exists_in_db(store_name):
                return jsonify(message="Store already exists."), 409  # 409 Conflict

            new_store = Stores(name=store_name, user_id=current_user._id)
            db.session.add(new_store)
            db.session.commit()
            return jsonify(message="Store added successfully."), 201  # 201 Created
        
        except Exception as e:
            print("An error occurred while adding the store:", e)
            return jsonify(error_message="An error occurred while adding the store."), 500  # 500 Internal Server Error
    else:
        return jsonify(error_message="User authentication failed."), 401  # 401 Unauthorized


def inDatabase(email):
    user = User.query.filter_by(email=email).first()
    if user is not None:
        return True # in DB
    else:
        return False

def addUser(first_name, last_name, email, name_of_restaurant, pword ):
    user = User(
        first_name = first_name, last_name=last_name, email=email, name_of_restaurant=name_of_restaurant, password=pword)
    db.session.add(user)
    db.session.commit()

    return user

@app.route('/create-user', methods=["POST"])
def createUser():
    
    try:
        user_info = request.get_json()
        email = user_info["email"]

        if not inDatabase(email):
            new_user = addUser(
                user_info['firstName'],
                user_info['lastName'],
                user_info['email'],
                user_info['restaurantName'],
                user_info['password'],
            )
            session['user'] = new_user._id


            return jsonify(message="User created successfully"), 201
        else:
            return jsonify(message="User already in Database"), 409  # 409 Conflict might be more appropriate

    except Exception as e:
        print('An exception occurred: ', e)
        return jsonify({"error": str(e)}), 500  # Ensure the error message is serializable
        


         
@app.route('/login', methods=["POST"])
def login():

    user_info = request.get_json()
    entered_email = user_info['email']
    entered_password = user_info['password']

    if "user" not in session:
        user = User.query.filter_by(email = entered_email).first()

        # if the person loggin in has an account
        if user is not None:
            # were the sign in credentials correct? 
            if user.email == entered_email and user.check_password(entered_password):
                # session['user'] = user._id
                print("User created and signed in")
                session['user'] = user._id
                return jsonify(first_name = user.first_name, 
                               last_name = user.last_name, 
                               email= entered_email, 
                               name_of_restaurant=user.name_of_restaurant
                               ), 200
            

            else:
                return jsonify(errMsg="You entered the wrong email and or password "), 500


        else:
            return jsonify(errMsg="The account doesn't exist"), 500
        
    
    else:
        print("Someone is already signed in somehow")
        return jsonify(errMsg=" Someone is signed in already"), 500


@app.route('/logout' ,methods=["POST"] )
def logout():
    if "user" in session:
        session.pop('user', None)  # Clear the user from the session
        return jsonify(message = "Logged out"), 200
    else:
        print("No one is logged in")
        return jsonify(message = "No one is logged in"), 400

# returns user or none
def get_current_user():
    if "user" in session:
        user = User.query.filter_by(_id=session['user']).first()
        return user
    else:
        return None
  

def store_exists_in_db(store_name):
    if "user" in session:
        current_user = get_current_user()
        try:
            # Directly query for the store by name and user_id
            store_exists = Stores.query.filter_by(name=store_name, user_id=current_user._id).first() is not None
            return store_exists
        except Exception as e:
            print("Error checking store existence:", e)
            return False  # Return False if an error occurs
    else:
        print("User not logged in.")
        return False





def analyze(image, new_receipt):

    try:
        all_receipts_data, recs = analyze_receipts(image, new_receipt)
        # print(all_receipts_data)
        # formatted_data = display_nicely(all_receipts_data)
        
        print("###" * 20)

    except HttpResponseError as error:
        print(
            "For more information about troubleshooting errors, see the following guide: "
            "https://aka.ms/azsdk/python/formrecognizer/troubleshooting"
        )
        # Examples of how to check an HttpResponseError
        # Check by error code:
        if error.error is not None:
            if error.error.code == "InvalidImage":
                print(f"Received an invalid image error: {error.error}")
            if error.error.code == "InvalidRequest":
                print(f"Received an invalid request error: {error.error}")
            # Raise the error again after printing it
            raise
        # If the inner error is None and then it is possible to check the message to get more information:
        if "Invalid request".casefold() in error.message.casefold():
            print(f"Uh-oh! Seems there was an invalid request: {error}")
        # Raise the error again
        raise

    except Exception as error:
        return jsonify({"Error ": error}), 500

if __name__ == '__main__':
    # ssl_context='adhoc'
    app.run(debug=True, host='0.0.0.0', port='5001')

    


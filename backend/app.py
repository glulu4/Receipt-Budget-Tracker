import datetime
from flask import Flask, request, jsonify, make_response
from sqlalchemy import extract, func
from flask_cors import CORS
import os
import requests
import zipfile
import uuid

from receipt import Receipt


from doc_intel_quickstart import analyze_receipts
import json
from azure.core.exceptions import HttpResponseError
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient
from datetime import datetime, date, time, timedelta
from model import db, Receipt as ReceiptModel, Item

sessions = {}


app = Flask(__name__)
cors = CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = 'sqlite:///receipt.db' 
db.init_app(app) # instead of passing 'app' to db = SQLAlchemy(app) in model.py


# @app.cli.command('initdb')
# def initdb_command():


@app.cli.command('initdb')
def initdb_command():
    db.drop_all()
    db.create_all() # creates tabel for all defined models
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


@app.route('/add_to_db', methods=['POST'])
def add_receipt_to_db():

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



@app.route('/get-receipt', methods=['GET'])
def get_receipt():
    try:
        all_receipts = ReceiptModel.query.all()

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


# gets total spend and ounces
@app.route("/get-current-months-totals",  methods=['GET'])
def get_totals():
    total_spent = get_month_total_spend()
    total_ounces = get_current_month_total_ounces() 

    return jsonify(total_spent=total_spent, total_ounces=total_ounces), 201




def get_month_total_spend(year=None, month=None):
    if year is None or month is None:
        current_year = datetime.now().year
        current_month = datetime.now().month
    else:
        current_year = year
        current_month = month

    # Query to filter receipts from the specified month
    receipts = ReceiptModel.query.filter(
        extract('year', ReceiptModel.date) == current_year,
        extract('month', ReceiptModel.date) == current_month
    ).all()

    total = sum(receipt.total for receipt in receipts)
    return total



# def get_current_months_total_spend():

#     current_year = datetime.now().year
#     current_month = datetime.now().month

#     # Query to filter receipts from the current month
#     this_months_receipts = ReceiptModel.query.filter(
#         extract('year', ReceiptModel.date) == current_year,
#         extract('month', ReceiptModel.date) == current_month
#     ).all()

#     total = 0.0
#     for receipt in this_months_receipts:
#         total += receipt.total
    

#     return total


# def get_current_month_total_ounces():
#     # Get the current date
#     current_date = datetime.now()

#     # Get the first and last day of the current month
#     first_day_of_month = current_date.replace(day=1)
#     last_day_of_month = current_date.replace(month=current_date.month % 12 + 1, day=1) - timedelta(days=1)

#     # Query to sum the ounces for all items in receipts of the current month
#     total_ounces = db.session.query(func.sum(Item.total_ounces))\
#                     .join(Receipt, Receipt._id == Item.receipt_id)\
#                     .filter(Receipt.date >= first_day_of_month, Receipt.date <= last_day_of_month)\
#                     .scalar()

#     return total_ounces if total_ounces is not None else 0

def get_current_month_total_ounces():
    current_year = datetime.now().year
    current_month = datetime.now().month

    # Query to sum the ounces for all items in receipts of the current month
    total_ounces = db.session.query(func.sum(Item.total_ounces))\
                    .join(ReceiptModel, ReceiptModel._id == Item.receipt_id)\
                    .filter(extract('year', ReceiptModel.date) == current_year,
                            extract('month', ReceiptModel.date) == current_month)\
                    .scalar()

    return total_ounces if total_ounces is not None else 0



   

  



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
    # with app.app_context():
    #     db.drop_all()  # Create tables for your models
    #     db.create_all() # creates tabel for all defined models
    #     print('Initialized the database.')
    app.run(debug=True, host='0.0.0.0', port='5001')




# def get_monthly_totals(year=None, month=None):
#     if year is None or month is None:
#         current_date = datetime.now()
#     else:
#         current_date = datetime(year, month, 1)

#     first_day_of_month = current_date.replace(day=1)
#     last_day_of_month = current_date.replace(month=current_date.month % 12 + 1, day=1) - timedelta(days=1)

#     query_result = db.session.query(
#                     func.sum(Receipt.total).label('total_spend'),
#                     func.sum(Item.num_oz).label('total_ounces')
#                 )\
#                 .join(Item, Receipt._id == Item.receipt_id)\
#                 .filter(Receipt.date >= first_day_of_month, Receipt.date <= last_day_of_month)\
#                 .one()

#     total_spend = query_result.total_spend if query_result.total_spend is not None else 0
#     total_ounces = query_result.total_ounces if query_result.total_ounces is not None else 0

#     return {
#         'total_spend': total_spend,
#         'total_ounces': total_ounces
#     }

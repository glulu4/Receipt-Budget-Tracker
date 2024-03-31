from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash


# note this should only be created once per project
db = SQLAlchemy()


class User(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    first_name = db.Column(db.String(100), nullable=False)
    last_name = db.Column(db.String(100), nullable=False)
    name_of_restaurant = db.Column(db.String(128), nullable=False)

    email = db.Column(db.String(100), unique=True, nullable=False) 
    password_hash = db.Column(db.String(300))

    receipts = db.relationship("Receipt", backref="user", lazy='dynamic')
    stores = db.relationship("Stores", backref="user", lazy='dynamic')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self):
        return {
            'id': self._id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'name_of_restaurant': self.name_of_restaurant,
            'email': self.email,
            "stores": [ store.to_dict() for store in self.stores],
            "receipts": self.receipts.count() # 'AppenderQuery' has no len(), hence count()
        }

    def __init__(self, first_name, last_name, name_of_restaurant, email, password):
        self.first_name = first_name
        self.last_name = last_name
        self.name_of_restaurant = name_of_restaurant
        self.email = email
        self.set_password(password)




class Stores(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(100), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user._id'))

    receipts = db.relationship("Receipt", backref="stores", lazy='dynamic')

    def __init__( self, name, user_id):
        self.name=name
        self.user_id = user_id
    
    def to_dict(self):
        return {
            "id" : self._id,
            "name" : self.name,
            "receipts": self.receipts.count()
        }
    
        

class Receipt(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    merchant_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    items = db.relationship('Item', backref='receipt', cascade='all, delete-orphan')
    subtotal = db.Column(db.Float, nullable=False)
    total_tax = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    pa_tax_paid = db.Column(db.Boolean, nullable=False)

    user_id = db.Column(db.Integer, db.ForeignKey('user._id'))
    store_id = db.Column(db.Integer, db.ForeignKey('stores._id'))

    def __init__(self, merchant_name, date, subtotal, total_tax, total, pa_tax_paid, user_id, store_id):
        self.merchant_name = merchant_name
        self.date = date
        self.subtotal = subtotal
        self.total_tax = total_tax
        self.total = total
        self.pa_tax_paid = pa_tax_paid
        self.user_id = user_id
        self.store_id = store_id

    def add_item(self, item):
        self.items.append(item)
        # db.session.commit()

    def to_dict(self):
        return {
            "_id" : self._id,
            "merchant_name" : self.merchant_name,
            "date" : str(self.date),
            'items': [item.to_dict() for item in self.items],
            "subtotal" : self.subtotal,
            "total_tax" : self.total_tax,
            "total" : self.total,
            "pa_tax_paid" : self.pa_tax_paid,
            "store_id" : self.store_id,
        }

class Item(db.Model):
    _id = db.Column(db.Integer, primary_key=True)
    description = db.Column(db.String(100), nullable=False)
    quantity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    total_price = db.Column(db.Float, nullable=False)

    case_size = db.Column(db.Integer, nullable=True)
    num_oz = db.Column(db.Float, nullable=True)

    receipt_id = db.Column(db.Integer, db.ForeignKey('receipt._id'), nullable=False)
    category = db.Column(db.String(100), nullable=True)
    total_ounces = db.Column(db.Float, nullable=True)

    def to_dict(self):

        return {
            "_id" : self._id,
            "description": self.description,
            "quantity" : self.quantity,
            "price" : self.price,
            "total_price" : self.total_price,
            "case_size" : self.case_size,
            "num_oz" : self.num_oz,
            "receipt_id" : self.receipt_id,
            "category" : self.category,
            "total_ounces": self.total_ounces,
        }




    def __init__(self, id_, description, price, total_price, category, quantity=1, case_size=None, num_oz=None, total_ounces=None):
        self.id_ = id_
        self.description = description
        self.quantity = quantity
        self.price = price
        self.total_price = total_price
        self.category=category
        self.case_size = case_size if case_size is not None else None
        self.num_oz = num_oz if num_oz is not None else None
        self.total_ounces = total_ounces if total_ounces is not None else None








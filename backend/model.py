from flask_sqlalchemy import SQLAlchemy

# note this should only be created once per project
db = SQLAlchemy()


class Receipt(db.Model):
    _id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    merchant_name = db.Column(db.String(100), nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    items = db.relationship('Item', backref='receipt')
    subtotal = db.Column(db.Float, nullable=False)
    total_tax = db.Column(db.Float, nullable=False)
    total = db.Column(db.Float, nullable=False)
    pa_tax_paid = db.Column(db.Boolean, nullable=False)

    def __init__(self, merchant_name, date, subtotal, total_tax, total, pa_tax_paid):
        self.merchant_name = merchant_name
        self.date = date
        self.subtotal = subtotal
        self.total_tax = total_tax
        self.total = total
        self.pa_tax_paid = pa_tax_paid

    def add_item(self, item):
        self.items.append(item)
        # db.session.commit()

    def to_dict(self):
        return {
            "_id" : self._id,
            "merchant_name: " : self.merchant_name,
            "date: " : str(self.date),
            'items': [item.to_dict() for item in self.items],
            "subtotal" : self.subtotal,
            "total_tax" : self.total_tax,
            "total" : self.total,
            "pa_tax_paid" : self.pa_tax_paid,
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




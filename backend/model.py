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
        }




    def __init__(self, id_, description, price, total_price, category, quantity=1, case_size=None, num_oz=None):
        self.id_ = id_
        self.description = description
        self.quantity = quantity
        self.price = price
        self.total_price = total_price
        self.category=category
        self.case_size = case_size if case_size is not None else None
        self.num_oz = num_oz if num_oz is not None else None





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

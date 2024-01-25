class Receipt:
     ######################### Item Class ##########################
    class Item:
        def __init__(self, id_, description, price, total_price, category=None, quantity=1, case_size=None, num_oz=None):
            self.id_ = id_
            self.description = description
            self.quantity = quantity
            self.price = price
            self.total_price = total_price
            self.case_size = case_size if case_size is not None else None
            self.num_oz = num_oz if num_oz is not None else None
            self.category = category

        def to_dict(self):
            return {
                'id_' : self.id_ ,
                'description': self.description,
                'quantity': self.quantity,
                'price': self.price,
                'total_price': self.total_price,
                'case_size': self.case_size,
                'num_oz': self.num_oz,
                'category': self.category
            }

        def __init__(self, id_=None, description='', price=0.0, total_price=0.0, category=None, quantity=1, case_size=None, num_oz=None):
            self.id_ = id_
            self.description = description
            self.quantity = quantity
            self.price = price
            self.total_price = total_price
            self.case_size = case_size
            self.num_oz = num_oz
            self.category = category

        def __str__(self):
            return (
                f"Id: {self.id_}, "
                f"Description: {self.description}, "
                f"Quantity: {self.quantity}, "
                f"Price: {self.price}, "
                f"Total Price: {self.total_price}, "
                f"Case Size: {self.case_size}, "
                f"Item Size: {self.num_oz} "
                f"Category: {self.category} "
                )


        ######################### Item Class ##########################


    def __init__(self, merchant_name, date, subtotal, total_tax, total, tip, pa_tax_paid): 
        self.merchant_name = merchant_name
        self.date = date
        self.items = []
        self.subtotal = subtotal
        self.total_tax = total_tax
        self.total = total
        self.pa_tax_paid = pa_tax_paid


    def __init__(self, merchant_name=None, date=None, subtotal=0, total_tax=0, total=0, tip=0, pa_tax_paid=False): 
        self.merchant_name = merchant_name
        self.date = date
        self.items = []
        self.subtotal = subtotal
        self.total_tax = total_tax
        self.total = total
        self.pa_tax_paid = pa_tax_paid

    # def add_item(self, description, price, total_price, quantity=1, case_size=None, num_oz=None):
    #     new_item = self.Item(description, price, total_price, quantity, case_size, num_oz)
    #     self.items.append(new_item)

    def add_item(self, item):
        if isinstance(item, self.Item):
            self.items.append(item)
        else:
            raise TypeError("The provided object is not an instance of Item")

    def to_dict(self):
        return {
            'merchant_name': self.merchant_name,
            'date': str(self.date),
            'items': [item.to_dict() for item in self.items],
            'subtotal': self.subtotal,
            'total_tax': self.total_tax,
            'total': self.total,
            'pa_tax_paid': self.pa_tax_paid
        }


    def __str__(self):
        receipt_details = f"Merchant Name: {self.merchant_name}\n"
        receipt_details += f"Date: {self.date}\n"
        receipt_details += f"Subtotal: {self.subtotal}\n"
        receipt_details += f"Total Tax: {self.total_tax}\n"
        receipt_details += f"Total: {self.total}\n"
        receipt_details += f"PA Tax Paid: {self.pa_tax_paid}\n"
        receipt_details += "Items:\n"
        for item in self.items:
            receipt_details += f"    {item}\n" # implicitly calls items str method
        return receipt_details
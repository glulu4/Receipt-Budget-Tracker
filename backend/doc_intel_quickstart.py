# coding: utf-8

# -------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See License.txt in the project root for
# license information.
# --------------------------------------------------------------------------

"""
FILE: sample_analyze_receipts.py

DESCRIPTION:
    This sample demonstrates how to analyze and extract common fields from receipts,
    using a pre-trained receipt model.

    See fields found on a receipt here:
    https://aka.ms/azsdk/formrecognizer/receiptfieldschema

USAGE:
    python sample_analyze_receipts.py

    Set the environment variables with your own values before running the sample:
    1) AZURE_FORM_RECOGNIZER_ENDPOINT - the endpoint to your Form Recognizer resource.
    2) AZURE_FORM_RECOGNIZER_KEY - your Form Recognizer API key
"""

import os
import sys
from azure.core.exceptions import HttpResponseError
from azure.core.credentials import AzureKeyCredential
from azure.ai.formrecognizer import DocumentAnalysisClient

from receipt import Receipt
import re


def is_drink(item_description):
    drinks = ['coke', 'pepsi', 'snapple', 'fanta', 'dr\.pepper']
    pattern = '|'.join(drinks)  # Creates a pattern like 'coke|pepsi|snapple|fanta|dr\.pepper'


    return re.search(pattern, item_description.lower()) is not None

def analyze_receipts(image_data, new_receipt):

    # endpoint = os.environ["AZURE_FORM_RECOGNIZER_ENDPOINT"]
    # key = os.environ["AZURE_FORM_RECOGNIZER_KEY"]
    endpoint = "https://react-scanning-app.cognitiveservices.azure.com/"
    key = "eab253bf7dc34e3bba9c40f487811a91"

    document_analysis_client = DocumentAnalysisClient(
        endpoint=endpoint, credential=AzureKeyCredential(key)
    )
    
    poller = document_analysis_client.begin_analyze_document(
        model_id="prebuilt-receipt", document=image_data, locale="en-US"
    )
    receipts = poller.result()

    all_receipts_data = []  # List to store data of all receipts

    for idx, receipt in enumerate(receipts.documents):
        print("&" * 60)
        print( receipt )
        print("&" * 60)

        print(f"--------Analysis of receipt #{idx + 1}--------")
        receipt_data = {"ReceiptNumber": idx + 1}

        if receipt.doc_type:
            print(f"Receipt type: {receipt.doc_type}")
            receipt_data["ReceiptType"] = receipt.doc_type

        merchant_name = receipt.fields.get("MerchantName")
        if merchant_name:
            new_receipt.merchant_name = merchant_name.value

            print(f"Merchant Name: {merchant_name.value} has confidence: {merchant_name.confidence}")
            receipt_data["MerchantName"] = {"Name": merchant_name.value, "Confidence": merchant_name.confidence}

        transaction_date = receipt.fields.get("TransactionDate")
        if transaction_date:
            new_receipt.date = transaction_date.value

            print(f"Transaction Date: {transaction_date.value} has confidence: {transaction_date.confidence}")
            receipt_data["TransactionDate"] = {"Date": transaction_date.value, "Confidence": transaction_date.confidence}

        

        receipt_items = []
        if receipt.fields.get("Items"):
            
            print("Receipt items:")
            id_count = 1
            for item_idx, item in enumerate(receipt.fields.get("Items").value):
                my_item = new_receipt.Item()
                
                my_item.id_ = id_count
                id_count+=1
                item_data = {}
                print(f"...Item #{item_idx + 1}")

                item_description = item.value.get("Description")
                if item_description:

                    if is_drink( item_description.value.lower() ):
                        my_item.category = 'drink'

                    my_item.description = item_description.value.lower().capitalize()


                    print(f"......Item Description: {item_description.value} has confidence: {item_description.confidence}")
                    item_data["Description"] = {"Value": item_description.value, "Confidence": item_description.confidence}

                item_quantity = item.value.get("Quantity")
                if item_quantity:
                    my_item.quantity = item_quantity.value

                    print(f"......Item Quantity: {item_quantity.value} has confidence: {item_quantity.confidence}")
                    item_data["Quantity"] = {"Value": item_quantity.value, "Confidence": item_quantity.confidence}

                item_price = item.value.get("Price")
                if item_price:
                    my_item.price = item_price.value
                    print(f"......Individual Item Price: {item_price.value} has confidence: {item_price.confidence}")
                    item_data["Price"] = {"Value": item_price.value, "Confidence": item_price.confidence}

                item_total_price = item.value.get("TotalPrice")
                if item_total_price:
                    my_item.total_price = item_total_price.value
                    print(f"......Total Item Price: {item_total_price.value} has confidence: {item_total_price.confidence}")
                    item_data["TotalPrice"] = {"Value": item_total_price.value, "Confidence": item_total_price.confidence}


                # potentially scan description for teh case size or other things
                # receipt_items.append(item_data)

                new_receipt.add_item (my_item)
            # receipt_data["Items"] = receipt_items

        subtotal = receipt.fields.get("Subtotal")
        if subtotal:
            new_receipt.subtotal = subtotal.value
            print(f"Subtotal: {subtotal.value} has confidence: {subtotal.confidence}")
            receipt_data["Subtotal"] = {"Value": subtotal.value, "Confidence": subtotal.confidence}


        # regex this bitch and find the 'PA Tax' and crate boolean

        if receipt.fields.get("TaxDetails"):
            tax_details = receipt.fields.get("TaxDetails")
            if hasattr(tax_details, 'value') and isinstance(tax_details.value, list):
                for tax_item in tax_details.value:
                    if hasattr(tax_item, 'value') and 'content' in tax_item.value:
                        content = tax_item.value['content']
                        print(content)



        tax = receipt.fields.get("TotalTax")
        if tax:
            new_receipt.total_tax = tax.value

            print(f"Total tax: {tax.value} has confidence: {tax.confidence}")
            receipt_data["TotalTax"] = {"Value": tax.value, "Confidence": tax.confidence}

        tip = receipt.fields.get("Tip")
        if tip:
            new_receipt.tip = tip.value

            print(f"Tip: {tip.value} has confidence: {tip.confidence}")
            receipt_data["Tip"] = {"Value": tip.value, "Confidence": tip.confidence}

        total = receipt.fields.get("Total")
        if total:
            new_receipt.total = total.value

            print(f"Total: {total.value} has confidence: {total.confidence}")
            receipt_data["Total"] = {"Value": total.value, "Confidence": total.confidence}

        print("--------------------------------------")

        all_receipts_data.append(receipt_data)
    
    if 'TaxDetails' in receipt.fields:
        tax_details = receipt.fields['TaxDetails']
        if tax_details.value and len(tax_details.value) > 0:
            # Access the first tax detail item
            tax_content = tax_details.value[0].content
            print(tax_content)

    return all_receipts_data, receipts




# start_date = '2024-01-20'
# end_date = '2024-02-20'

# query = session.query(Item, Receipt).join(Receipt).filter(
#     Item.category == 'Drink',
#     Receipt.date.between(start_date, end_date)
# )

# for item, receipt in query.all():
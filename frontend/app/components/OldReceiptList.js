import React, { useState, useCallback, useEffect } from 'react';
import { 
    View, 
    SafeAreaView, 
    Text, 
    StyleSheet, 
    TouchableOpacity, 
    Modal,
    FlatList

} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const styles = StyleSheet.create({

    receiptRow:{
        flexDirection:'row',
        justifyContent:'space-between',
        margin:25

    }

})


const OldReceiptList = ({ receipts }) => {

    const navigation = useNavigation()

    const temp = 
    { "receipts": 
    [
        { 
            "_id": 1, 
            "date": 
            "2024-01-01 00:00:00", 
            "items": [Array], 
            "merchant_name": "Target", 
            "pa_tax_paid": false, 
            "subtotal": 145.18, 
            "total": 146.71, 
            "total_tax": 1.53 
        }, 
        { 
            "_id": 2, 
            "date": "2024-01-07 00:00:00", 
            "items": [Array], 
            "merchant_name": "Target", 
            "pa_tax_paid": false, 
            "subtotal": 133.85, 
            "total": 137.8, 
            "total_tax": 3.95 
        }, 
        { 
            "_id": 3, 
            "date": 
            "2024-01-07 00:00:00", 
            "items": [Array], 
            "merchant_name": "Targett", 
            "pa_tax_paid": false, 
            "subtotal": 133.85, 
            "total": 137.8, 
            "total_tax": 3.95 
        }, 
        { 
            "_id": 4, 
            "date": "2024-01-07 00:00:00", 
            "items": [Array], 
            "merchant_name": "Target", 
            "pa_tax_paid": false, 
            "subtotal": 133.85, 
            "total": 137.8, 
            "total_tax": 3.95 
        }, 
        { 
            "_id": 5, 
            "date": "2024-01-01 00:00:00", 
            "items": [Array], 
            "merchant_name": "Acme", 
            "pa_tax_paid": false, 
            "subtotal": 145.18, 
            "total": 146.71, 
            "total_tax": 1.53 
        }, 
        { 
            "_id": 6, 
            "date": "2024-01-07 00:00:00", 
            "items": [Array], 
            "merchant_name": "Shoprite", 
            "pa_tax_paid": false, 
            "subtotal": 133.85, 
            "total": 137.8, 
            "total_tax": 3.95 
        }, 
        
        { 
        "_id": 8, 
        "date": "2024-01-07 00:00:00", 
        "items": [Array], 
        "merchant_name": "Target", 
        "pa_tax_paid": false, 
        "subtotal": 133.85, 
        "total": 137.8, 
        "total_tax": 3.95 
    }] }


    // console.log("temp", temp);

    // const testReceipts = temp.receipts

    // console.log("testReceipts", testReceipts);
    // receipts = temp.receipts;

    console.log("receiptsvv", receipts);
    const displayReceipt = (receipt) => {
        console.log("receipt", receipt);
        navigation.navigate("ReceiptDisplay", { receipt: receipt })
    }


    function formatDate(date) {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateObj = new Date(date);
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        return `${month} ${year}`;



    }
    const renderItem = ({ item }) => (



        <TouchableOpacity onPress={() => displayReceipt(item)}>
            
            <View style={styles.receiptRow}>

                <Text style={{
                    fontSize:25
                }}>{item.merchant_name}</Text>
                <Text style={{
                    fontSize: 25
                }}>{formatDate(item.date)}</Text>
            </View>
        </TouchableOpacity>
    );

    

    return ( 
        <>
            <FlatList

                data={receipts}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
        </>


       



    );



}

export default OldReceiptList;
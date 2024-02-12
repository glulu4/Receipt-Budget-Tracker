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
import { useGlobalContext } from './TabBarVisibilityContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

const styles = StyleSheet.create({
    backArrow:{
        position: 'absolute',
        margin: 12
    },
    container: {
        flex: 1,
        margin: 10,

    },
    headerText: {
        alignSelf: 'center',
        fontSize: 60,
        zIndex: 1, // Add this line
        fontWeight: '500',
    },
    rowStyle: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 20,
        padding: 20,
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        zIndex: 0,

    },
    item: {
        margin: 10,
        fontSize: 20
    },
    itemHeader: {
        fontSize: 30,
        marginTop: 40,
        margin: 10,

    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22
    },

    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 50,
    },
    bottomPrefix: {
        fontWeight: '700',
        fontSize: 25
    },
    bottomData: {
        fontSize: 25,
    },
    buttonStyle: {
        margin: 20,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#77c3ec',
        backgroundColor: 'pink',



    },
    buttonText: {
        color: 'black',
        fontSize: 18,
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: 15
    },

})

export default function ReceiptDisplay({route, navigation}){
    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const receipt = route.params.receipt;

    // const items = receipt.items

    

    function formatDate(date){

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateObj = new Date(date);
        const month = months[dateObj.getMonth()];
        const day = String(dateObj.getDate()).padStart(2, '0');
        const year = dateObj.getFullYear();

        return `${month} ${day}, ${year}`;



    }
    useEffect(() => {
        setIsTabBarVisible(false)
    }, [])

    const goBack = () => {
        setIsTabBarVisible(true)
        navigation.navigate("MonthlyScreen")
    }

    const items = [
            {
                "case_size": null,
                "category": null,
                "description": "Fage",
                "id_": 1,
                "num_oz": null,
                "price": 1.49,
                "quantity": 7,
                "total_price": 10.43
            },
            {
                "case_size": null,
                "category": null,
                "description": "Quest",
                "id_": 2,
                "num_oz": null,
                "price": 9.49,
                "quantity": 1,
                "total_price": 7.48
            },
            {
                "case_size": null,
                "category": null,
                "description": "Gg eggs",
                "id_": 3,
                "num_oz": null,
                "price": 2.59,
                "quantity": 3,
                "total_price": 7.77
            },
            {
                "case_size": null,
                "category": null,
                "description": "Legendaryfds",
                "id_": 4,
                "num_oz": null,
                "price": 9.99,
                "quantity": 1,
                "total_price": 7.82
            },
            {
                "case_size": null,
                "category": null,
                "description": "Halo top",
                "id_": 5,
                "num_oz": null,
                "price": 0,
                "quantity": 1,
                "total_price": 4.69
            },
            // ... (additional items continue in the same format)
        ]

    const renderItem = ({ item }) => (
            <View style={styles.rowStyle}>
                <Text style={styles.item}>{String(item.quantity)}</Text>
                <Text style={styles.item}>{item.description}</Text>
            </View>



    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>{receipt.merchant_name}</Text>
            </View>

            <View style={styles.rowStyle}>
                <Text style={styles.itemHeader}>Qty</Text>
                <Text style={styles.itemHeader}>Description</Text>
            </View>


            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={{
                    backgroundColor: 'lightgray',
                    borderRadius: 6,
                    margin: 5,
                    zIndex: 0


                }}
            />
            <View style={{
                paddingTop: 80,
                marginBottom: 30,
                alignSelf: 'center'
            }}>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Date: </Text>
                    <Text style={styles.bottomData}>{formatDate(receipt.date)}</Text>
                    {/* <Text style={styles.bottomData}>{formatDate(r[0].date)}</Text> */}
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Subtotal: </Text>
                    <Text style={styles.bottomData}>${receipt.subtotal}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total Tax: </Text>
                    <Text style={styles.bottomData}>${receipt.total_tax}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total: </Text>
                    <Text style={styles.bottomData}>${receipt.total}</Text>
                </View>

            </View>

            <TouchableOpacity style={styles.backArrow} onPress={goBack}>
                <MaterialIcons name='arrow-back' size={30}></MaterialIcons>
            </TouchableOpacity>
        </SafeAreaView>

    );

}
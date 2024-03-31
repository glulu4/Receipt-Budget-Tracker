import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './TabBarVisibilityContext';

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    Switch,

} from 'react-native';

import SwipeRow from '@nghinv/react-native-swipe-row';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import StoreDropdown from './StoreDropdown';

import EditModal from './EditItemModal';


const styles = StyleSheet.create({
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
        margin: 15,
        // borderBottomWidth: 3,
        // borderBottomColor: 'white',
        zIndex: 0,

    },
    firstrowStyle:{
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
        margin: 10
    },
    itemList:{
        
        backgroundColor: '#EEE8E9',
        // backgroundColor:'#ACECF7',
        borderRadius: 6,
        margin: 5,
        zIndex: 0


    
    },
    errorMsg: {
        textAlign: "center",
        fontSize: 20,
        color: '#b33a3a'

    },

})


// eventually add store lise here
export default function DataDisplay({ navigation, route }) {


    console.log("In Datadisplay.js");

    const [errorMsg, setErrorMsg] = useState("")
    const [drinkError, setDrinkError] = useState(false)

    const storeList = route.params?.storeList;
    const r = route.params?.receiptData;

    // console.log("r", r);


    const receiptInfo = extractReceiptData(r)

    // console.log("receiptInfo", receiptInfo);

    let condensedItems = condenseList(receiptInfo.items)

    const [items, setItems] = useState(condensedItems ); // Assuming this will be populated from your data source
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [ storeName, setStoreName] = useState("Store Name...")
    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const backendAddress = route.params.backendAddress;
    const [isEnabled, setIsEnabled] = useState(false);
    const toggleSwitch = () => setIsEnabled(previousState => !previousState);

    // const [storeList, setStoreList] = useState([])


    function extractReceiptData(receiptArray) {
        const receiptData = receiptArray.find(obj => obj.hasOwnProperty('date'));

        if (!receiptData) {
            console.error("No receipt data found");
            return null;
        }

        // Extracting required information
        const { date, items, merchant_name, pa_tax_paid, subtotal, total, total_tax } = receiptData;

        // console.log('Date:', date);
        // console.log('Items:', items);
        // console.log('Merchant Name:', merchant_name);
        // console.log('PA Tax Paid:', pa_tax_paid);
        // console.log('Subtotal:', subtotal);
        // console.log('Total:', total);
        // console.log('Total Tax:', total_tax);
        return { date, items, merchant_name, pa_tax_paid, subtotal, total, total_tax };
    }

    function condenseList(items) {
        try {

            const condensedList = {};

            items.forEach(item => {
                const { description, price, total_price, quantity } = item;
                let individualCost = 0;
                if (quantity === 1) {
                    individualCost = total_price
                }
                else {
                    individualCost = price
                }
                // check for total_price and 
                const key = `${description}_${individualCost}`;

                if (condensedList[key]) {
                    condensedList[key].quantity += item.quantity;
                    condensedList[key].num_oz += item.num_oz || 0; // Sum num_oz if defined
                    condensedList[key].price = individualCost
                    condensedList[key].total_price += total_price
                } else {
                    condensedList[key] = { ...item }; // Copy the item
                    // delete condensedList[key].id_; // Remove the id_ property
                }
            });

            return Object.values(condensedList);
            
        } catch (error) {

            console.log("Error from datadisplay: ", error);
            navigation.navigate("MainApp")
            
        }

    }


    useEffect(() => {
        setIsTabBarVisible(false)

    }, [])

    const handleStoreSelect = (selectedStoreName) => {
        setStoreName(selectedStoreName);
    };

    // FOR TESTING add get store list and useffect here
    


    // returns true if the store is in our list
    const containsStore = () => {
        let list = storeList.stores;

        for (const store of list) {
            if (store.name.toLowerCase() === storeName.toLowerCase()) {

                return { found: true, storeId: store.id };
            }
        }

        return { found: false, storeId: null };
    };



    const addStore2DB = async () => {
        let storeId = null;
        const body = { "new_store": storeName };

        try {
            const response = await fetch(`${backendAddress}/add-store`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log("result", result);

            // Extract the store_id from the result
            storeId = result.store_id; // Adjusted based on your log structure
        } catch (error) {
            console.log("Error posting new store:", error);
        }

        return storeId; // This will now return the actual store ID or null if the request failed
    };


    const submitData = async () => {

        for (let itm of items) {
            if (itm.category === "tax-drink") {
                if (!itm.quantity) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs a quantity`)
                    return;
                }
                if (!itm.num_oz) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs an ounce amount`)
                    return;
                }
                if (!itm.case_size) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs a case size`)
                    return;
                }
            }
        }

        if ( storeName === "Store Name..."){
            setDrinkError(true)
            setErrorMsg(`Enter a store name`)
            return;
        }

        // if we dont have store, add it to DB
        let storeId = null;
        
        let storeInDB = containsStore()
        if ( !storeInDB.found ){

            storeId = await addStore2DB();

            console.log("?////////////////////////////////////////////////////////////////////////////////////");
            console.log("storeId", storeId);
        }
        else{
            console.log("the store is already in the db jawns");
            storeId = storeInDB.storeId
        }




        let body = {
            ...receiptInfo, // spread the receipt
            merchant_name:storeName,
            store_id: storeId, 
            items: items,
            pa_tax_paid: isEnabled,

        }

        // console.log("body", body);



        fetch(`${backendAddress}/add-to-db`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            // console.log(response)
            return response.json();
        })
            // needed because above then returns
            .then((result) => {
                console.log(result);
            })
            .catch(() => {
                console.log("Error posting receipt");
            });


        setIsTabBarVisible(true);
        navigation.navigate("MainApp")


    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeEditModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };


    const saveEdit = (updatedItem) => {
        const updatedItems = items.map(item =>
            item.id_ === updatedItem.id_ ? updatedItem : item
        );
        setItems(updatedItems); // updates the whole item array 
        closeEditModal();
    };

    const formatDate = (date) => {

        console.log("date", date);

        if (date) {



            const dateObj = new Date(date);
            dateObj.setDate(dateObj.getDate() + 1);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short', // Abbreviated month name (e.g., "Jan")
                day: 'numeric', // Numeric day
                year: 'numeric' // Numeric year
            });

            console.log(formattedDate);
            return formattedDate
        }

        else{
            const date = receipt ? receipt.date : "No date found";
            console.log("Date from receipt:", date);

            const dateObj = new Date(date);
            dateObj.setDate(dateObj.getDate() + 1);
            const formattedDate = dateObj.toLocaleDateString('en-US', {
                month: 'short', // Abbreviated month name (e.g., "Jan")
                day: 'numeric', // Numeric day
                year: 'numeric' // Numeric year
            });
            return formattedDate
        }

       



    }



    const deleteRow = (item) => {
        const updatedItems = items.filter((currItem) => currItem.id_ !== item.id_);
        setItems(updatedItems);
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openEditModal(item)}>

            <SwipeRow
                right={[

                    {
                        title: 'Delete',
                        backgroundColor: 'tomato',
                        icon: { name: 'delete' },
                        onPress: () => deleteRow(item),
                    },
                ]}
                onSwipe={(swipeData) => {
                    console.log("swipeData", swipeData);

                }}
                style={{ marginVertical: 1 }}            >
               


                    <View style={styles.firstrowStyle}>
                        <Text style={styles.item}>{String(item.quantity)}</Text>
                        <Text style={styles.item}>{item.description}</Text>
                    </View>
               
            </SwipeRow>
        </TouchableOpacity>

           
        
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>

                <StoreDropdown selectedStoreName={storeName} onStoreSelect={handleStoreSelect} storeList={storeList} />
            </View>

            <View style={styles.rowStyle}>
                <Text style={styles.itemHeader}>Qty</Text>
                <Text style={styles.itemHeader}>Description</Text>
            </View>
            <GestureHandlerRootView style={{ flex: 1 }}>

                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    style={styles.itemList}
                />
            </GestureHandlerRootView>

            {isModalVisible && (
                <EditModal
                    isVisible={isModalVisible}
                    onClose={closeEditModal}
                    onSave={saveEdit}
                    item={selectedItem}
                />
            )}
            <View style={{
                paddingTop: 50,
                marginBottom: 10,
                alignSelf: 'center'
            }}>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Date: </Text>
                    <Text style={styles.bottomData}>{formatDate(receiptInfo.date)}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Subtotal: </Text>
                    <Text style={styles.bottomData}>${receiptInfo.subtotal}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total Tax: </Text>
                    <Text style={styles.bottomData}>${receiptInfo.total_tax}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total: </Text>
                    <Text style={styles.bottomData}>${receiptInfo.total}</Text>
                </View>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>PA Tax: </Text>
                    <View style={{ marginTop: 1 }}>
                        <Switch
                        
                            trackColor={{ false: '#767577', true: '#4f90ff' }}
                            thumbColor={isEnabled ? 'white' : '#f4f3f4'}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isEnabled}
                        />
                    </View>
                </View>

                {drinkError && <Text style={styles.errorMsg}>{errorMsg}</Text>}



                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={submitData}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>





            </View>
        </SafeAreaView>
    );
}
import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import { useGlobalContext } from './TabBarVisibilityContext';

import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { ACTION_DATE_SET, ACTION_DISMISSED, ACTION_NEUTRAL } from 'react-native-month-year-picker';


const styles = StyleSheet.create({

    screen: {
        flex: 1,
        // justifyContent: "center", // column
        alignItems: 'center', // row
        margin: 10,
        // marginTop:80,
    },
    title: {
        fontSize: 60,
        fontWeight: '600',
        fontFamily: 'monospace',
        textAlign: 'center'
    },
    buttonStyle: {
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
    listHeader: {
        fontSize: 30,
        margin: 25,
        marginBottom: 10,

        // textDecorationLine: 'underline', // This line can be removed as borderBottomWidth and borderColor are used for the underline

    },
    noListHeaderView: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'space-around',
        alignItems:'center',
        backgroundColor: '#EACBD2',
        marginTop:80,
        margin:20,
        borderRadius: 5,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 8,
            height: 8,
        },
        // borderBottomColor: '#77c3ec',
        // borderBottomWidth: 2,
    },
    listHeaderView:{





    },
    receiptRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        margin: 15,
        marginLeft: 30,

    },
    headerBox: {
        alignSelf: 'flex-start',
        margin: 10,

    },
    selectView: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
        margin: 15,
        gap: 10,
    },
    rowButton: {
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 10,
            height: 10,
        },

        flex: 1,
        backgroundColor: 'white',
        borderRadius: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    listStyle: {
        marginVertical:40,
        marginHorizontal: 30,

    },
    storeName: {
        fontSize: 25,
        fontWeight: '500'
    },
    ozHeader: {
        // marginTop: 0,
        // marginLeft: 30,
        fontSize: 25,
        fontWeight: '300',
        margin:10
    },
    listHeaderWith: {
        
        flexDirection: 'row',
        justifyContent: 'space-around',
        margin: 5,
        borderBottomColor: '#77c3ec',
        borderBottomWidth: 2,
        width: 'auto',
        paddingBottom: 10
    },
    noReceiptText:{
        fontSize: 35,
        margin: 15,
        fontWeight:'300'
    },
    displayBox: {
        flex: 1,
        shadowColor: '#000000',
        shadowOpacity: 0.05,
        shadowOffset: {
            width: 10,
            height: 10,
        },
        backgroundColor: '#EACBD2',
        borderRadius: 5,
        // height: 80,
        width:150,
        display:'flex',
        justifyContent:'center',
        alignItems:'center',
    },


})


const OldReceiptList = ({ receipts, navigation }) => {



    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();

    function formatDate(date) {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateObj = new Date(date);
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        return `${month} ${year}`;



    }

    const displayReceipt = (receipt) => {
        setIsTabBarVisible(false)
        navigation.navigate("ReceiptDisplay", { receipt: receipt });
    };

    const renderItem = ({ item }) => (
        <SafeAreaView>
            <TouchableOpacity onPress={() => displayReceipt(item)}>

                <View style={styles.receiptRow}>

                    <Text style={styles.storeName}>{item.merchant_name}</Text>

                </View>
            </TouchableOpacity>
        </SafeAreaView>

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
const Monthly = ({ route, navigation }) => {



    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [showList, setShowList] = useState(false);


    const showPicker = useCallback((value) => setShow(value), []);

    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const [receipts, setReceipts] = useState(null);

    const [totalOunces, setTotalOunces] = useState(0);
    const [taxableOz, setTaxableOz] = useState(0);
    const backendAddress = route.params.backendAddress;





    const onValueChange = useCallback(
        (event, newDate) => {

            let selectedDate = undefined

            switch (event) {
                case ACTION_DATE_SET:

                    console.log("we in date set");
                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);

                    getReceiptsFromDate(selectedDate)
                    break;
                case ACTION_NEUTRAL:
                    console.log("we in date neutral");

                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);
                    break;
                case ACTION_DISMISSED:

                    console.log("we in date cancelled");
                    setReceipts(null)
                    // setDate(undefined);


                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);
                default:
                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);
            }
        },
        [date, showPicker],
    );

    useEffect(() => {
        console.log("in monthly.js");
        // setIsTabBarVisible(true)

    }, [])






    function formatDate(date) {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateObj = new Date(date);
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        return `${month} ${year}`;



    }

    const getReceiptsFromDate = async (selectedDate) => {



        const dateObject = new Date(selectedDate);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // JavaScript months are 0-indexed

        console.log("Year:", year); // 2000
        console.log("Month:", month); // 1

        console.log(navigation.getState());



        fetch(`${backendAddress}/get-specific-months-receipts?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                console.log("dayta", data); // Process your data here
                setReceipts(data.receipts)

                let taxed_oz = data.oz.taxed_ounces
                let total_oz = data.oz.total_ounces
                setTotalOunces(total_oz)
                setTaxableOz(total_oz - taxed_oz)

                console.log("YURRR");
                setShowList(true)
            })
            .catch(error => {
                console.error('Error:', error);
            });

    }




    return (
        <SafeAreaView style={styles.screen}>


            <View style={styles.headerBox}>
                <Text style={styles.title}>Receipt Logs</Text>

            </View>


            <View style={{ flexDirection: 'row', marginTop: 20 }}>
                <TouchableOpacity style={styles.rowButton} onPress={() => showPicker(true)}>
                    <Text style={styles.buttonText}>Select Date</Text>
                    <Ionicons name="today-outline" size={30} style={{ marginRight: 10 }} />
                </TouchableOpacity>

            </View>

            {
                receipts?.length === 0 ?
                    <View style={styles.noListHeaderView}>
                        <Text style={styles.noReceiptText}>No Receipts from </Text>
                        <Text style={styles.noReceiptText}>{formatDate(date)}</Text>
                    </View>
                    :
                    showList &&
                    <View style={styles.listStyle}>


                            <View style={{
                                    flexDirection:'column',
                                    alignItems:'center',
                                    justifyContent:'center'}}>
                                    <Text style={{ fontSize: 35, fontWeight:'bold' }}>{formatDate(date)} Receipts</Text>

                            </View>

                            <View style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', gap: 10, flex:0.3 }}>
                                <View style={styles.displayBox}>
                                        <Text style={styles.ozHeader}>{totalOunces} Oz</Text>
                                </View>
                                <View style={styles.displayBox}>
                                    <Text style={styles.ozHeader}>{taxableOz} Taxable Oz</Text>
                                </View>
                            </View>


                        <OldReceiptList receipts={receipts} navigation={navigation} />
                    </View>
            }






            <Modal
                visible={show}
                transparent={true}
                animationType="slide"
                onRequestClose={() => showPicker(false)}
            >
                <MonthPicker
                    onChange={onValueChange}
                    value={date}
                    minimumDate={new Date(2000, 0)}
                    maximumDate={new Date(2080, 0)}
                />
            </Modal>



        </SafeAreaView>
    )

}
export default Monthly;

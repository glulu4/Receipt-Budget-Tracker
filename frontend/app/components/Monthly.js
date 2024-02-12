import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import { useGlobalContext } from './TabBarVisibilityContext';

import Fontisto from 'react-native-vector-icons/Fontisto'
import Ionicons from 'react-native-vector-icons/Ionicons';

import OldReceiptList from './OldReceiptList';
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
        fontFamily: 'monospace'
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
    listHeader : {
        fontSize:30
    },

})

const Monthly = ({route, navigation}) => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [showList, setShowList] = useState(false);


    const showPicker = useCallback((value) => setShow(value), []);

    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const [receipts, setReceipts] = useState(null);
    const IP = route.params.IP;


    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );




    useEffect(() => {
        console.log("datedate",date);
    },[])




    function formatDate(date) {

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateObj = new Date(date);
        const month = months[dateObj.getMonth()];
        const year = dateObj.getFullYear();

        return `${month} ${year}`;



    }

    const getReceiptsFromDate = async () => {



        const dateObject = new Date(date);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // JavaScript months are 0-indexed

        console.log("Year:", year); // 2000
        console.log("Month:", month); // 1



        fetch(`http://${IP}:5001/get-specific-months-receipts?year=${year}&month=${month}`)
            .then(response => response.json())
            .then(data => {
                console.log(data); // Process your data here
                setReceipts(data.receipts)
                console.log("YURRR");
                setShowList(true)
            })
            .catch(error => {
                console.error('Error:', error);
            }); 

    }

    return (
        <View style={styles.screen}>


            <View style={{
                alignSelf:'flex-start',
                margin:15
            }}>
                <Text style={styles.title}>Get old Receipts</Text>

            </View>


                {/* <Text>Month Year Picker Example</Text> */}
                {/* <Text>{moment(date, "MM-YYYY")}</Text> */}

                <View style={{
                    alignSelf:'flex-start',
                    flexDirection:'row',
                    margin: 15,
                    gap:10,
                   
                }}>
                <TouchableOpacity onPress={() => showPicker(true)}>
                        <Ionicons name="today-outline" size={50} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={getReceiptsFromDate}
                    >
                        <Text style={styles.buttonText}>Get Receipts</Text>
                    </TouchableOpacity>
                </View>
                  
                {
                    receipts?.length === 0 ? <Text style={styles.listHeader}>No Receipts from that month</Text> :
                    showList && 
                    <View>
                            <Text style={styles.listHeader}>Receipts from {formatDate(date)}</Text>
                        <OldReceiptList receipts={receipts} />
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



        </View>
    )

}
export default Monthly;


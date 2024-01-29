import React, { useState, useCallback, useEffect } from 'react';
import { View, SafeAreaView, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import MonthPicker from 'react-native-month-year-picker';
import { useGlobalContext } from './TabBarVisibilityContext';


const Monthly = ({route}) => {

    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const showPicker = useCallback((value) => setShow(value), []);

    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const IP = route.params.IP;


    const onValueChange = useCallback(
        (event, newDate) => {
            const selectedDate = newDate || date;

            showPicker(false);
            setDate(selectedDate);
        },
        [date, showPicker],
    );

    // useEffect(() => {
    //     setIsTabBarVisible(!isTabBarVisible)
    // }, [show])



    const styles = StyleSheet.create({

        screen: {
            flex:1,
            justifyContent:"space-around", // column
            alignItems:'center', // row
            // marginTop:80,
        }, 
        title: {
            fontSize: 60,
            fontWeight: '400',
            fontFamily: 'monospace'
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

    const openPicker = () => {
       
        showPicker(true);

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
                console.log("YURRR");
            })
            .catch(error => {
                console.error('Error:', error);
            }); 

    }

    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Monthly</Text>


                {/* <Text>Month Year Picker Example</Text> */}
                {/* <Text>{moment(date, "MM-YYYY")}</Text> */}

                <View>
                    <TouchableOpacity onPress={openPicker}>
                        <Text>OPEN</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.buttonStyle}
                        onPress={getReceiptsFromDate}
                    >
                        <Text style={styles.buttonText}>Next</Text>
                    </TouchableOpacity>
                </View>

                

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


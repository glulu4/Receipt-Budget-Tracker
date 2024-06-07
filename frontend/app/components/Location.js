import { Text, View, StyleSheet, TouchableOpacity, LogBox, Modal } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'

import { IndexPath, Layout, Select, SelectItem } from '@ui-kitten/components';
import MonthPicker from 'react-native-month-year-picker';

import { ACTION_DATE_SET, ACTION_DISMISSED, ACTION_NEUTRAL } from 'react-native-month-year-picker';
import Pie from 'react-native-pie'


const styles = StyleSheet.create({
    screen: {
        margin: 10,
        flex: 1,

    },
    htext: {
        textAlign: 'center',

        fontSize: 70,
        fontWeight: '500',
        marginVertical:10,


    },
    storeList: {
        // flex:1, // this is needed bruh
        // display:'flex',
        margin: 40,
        // alignItems: 'center'
    },

    rowButton: {
        flexDirection: 'row',
        justifyContent:'space-between',
        marginVertical:10,
    },
    container: {
        minHeight: 128,
    },
    container: { alignItems: 'center', justifyContent: 'center', height: 1050 },
    gauge: {
        position: 'absolute',
        width: 100,
        height: 160,
        alignItems: 'center',
        justifyContent: 'center',
    },
    gaugeText: {
        backgroundColor: 'transparent',
        color: '#000',
        fontSize: 24,
    },
})

const DropDown = ({ selectedIndex, setSelectedIndex }) => {
    const styles = StyleSheet.create({
        container: {
            minHeight: 30,
            borderRadius: 10,
            marginLeft: 80,
            marginRight: 80,
        },
    });

    // Define your options titles here
    const optionTitles = ['Past Week', 'Past Month', 'Specific Month', 'All Time'];

    // Function to return the title based on the current selectedIndex
    const getSelectedOptionTitle = () => {
        const { row } = selectedIndex; // Assuming selectedIndex is of type IndexPath
        return optionTitles[row] ?? 'Select Option'; // Default title if index is out of range
    };

    return (
        <Layout
            style={styles.container}
            level='1'
        >
            <Select
                selectedIndex={selectedIndex}
                onSelect={index => setSelectedIndex(index)}
                size='large'
                placeholder="Select Option"
                value={getSelectedOptionTitle()} // Dynamically display the selected title
            >
                {optionTitles.map((title, index) => (
                    <SelectItem key={index} title={title} />
                ))}
            </Select>
        </Layout>
    );
};


const Location = ({ navigation, route }) => {

    const [selectedIndex, setSelectedIndex] = useState(new IndexPath(7))


    const backendAddress = route.params?.backendAddress;

    const [store2total, setStore2Total] = useState({})
    const showPicker = useCallback((value) => setShow(value), []);
    const [date, setDate] = useState(new Date());
    const [show, setShow] = useState(false);

    const [colors, setColors] = useState([])

    const [chartData, setChartData] = useState({})


    useEffect(() => {
        const data = getPieChartData(); // Assume this does not modify state directly
        setChartData(data)
        // Do something with data here, like storing in state
    }, [store2total]); // Only recalculate when store2total changes


    useEffect(() => {

        const { row } = selectedIndex;
        console.log(row);

        switch (row) {
            // past week
            case 0:
                try {
                    getPastWeekOrMonthsStoreTotals(0)
                } catch (error) {
                    console.log(error);
                    console.log("error for past week in switch");
                }
                
                break;
            //past month
            case 1:
                try {
                    getPastWeekOrMonthsStoreTotals(1)
                } catch (error) {
                    console.log(error);
                    console.log("error for past month in switch");
                }                
                break;
            //specific month
            case 2:
                showPicker(true)

                break;
            //all time
            case 3:

                getAllTime()

                break;
        
            default:
                break;
        }
        console.log(selectedIndex);

    }, [selectedIndex])


    const getAllTime = () => {
        try {
            getStoreTotals();
        } catch (error) {
            console.log("No stores yet");
            setStore2Total({});
        }
    }





    const onValueChange = useCallback(
        (event, newDate) => {

            let selectedDate = undefined

            switch (event) {
                case ACTION_DATE_SET:

                    console.log("we in date set");
                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);

                    console.log("getting receipts");
                    try {
                        getSpecificMonthsStoreTotals(selectedDate)

                    } catch (error) {
                        console.log(error);
                        console.log("No stores yet");
                        setStore2Total({});
                    }
                    break;
                case ACTION_NEUTRAL:
                    console.log("we in date neutral");

                    selectedDate = newDate || date;
                    showPicker(false);
                    setDate(selectedDate);
                    break;
                case ACTION_DISMISSED:

                    console.log("we in date cancelled");



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

    const getStoreTotals = async () => {


        try {
            const response = await fetch(`${backendAddress}/get-store-totals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Stores:', data);
            setStore2Total(data); // Return the data for use with await

            
        } catch (error) {
            console.error('There was an error fetching the stores:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    }

    const getPastWeekOrMonthsStoreTotals = async (option) => {


        try {

            const response = await fetch(`${backendAddress}/get-past-week-month-store-totals?option=${option}`)
            if (!response.ok) {
                if( response.status >= 500 ){
                    console.log("Server Error");
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Stores:', data);
            setStore2Total(data); // Return the data for use with await

        } catch (error) {
            console.error('There was an error fetching the stores:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    }

    const getSpecificMonthsStoreTotals = async (selectedDate) => {

        const dateObject = new Date(selectedDate);

        const year = dateObject.getFullYear();
        const month = dateObject.getMonth() + 1; // JavaScript months are 0-indexed

        try{

            const response = await fetch(`${backendAddress}/get-specific-month-store-totals?year=${year}&month=${month}`);

            if ( !response.ok){
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Stores:', data);
            setStore2Total(data); // Return the data for use with await

            
        }catch(error) {
            console.error('There was an error fetching the stores:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }

    }

    const formatPrice = (price) => {
        // add a 0 and ensure it looks nice
        return price
    }

    const pickColor = () => {
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        return `rgb(${r},${g},${b})`;
    };


    const getPieChartData = () => {
        const storeTotals = Object.values(store2total);
        const total = storeTotals.reduce((acc, currentValue) => acc + currentValue, 0);

        const newColors = [];
        const percentages = Object.keys(store2total).map(store => {
            const percentage = (store2total[store] / total) * 100;
            const color = pickColor();
            newColors.push(color);
            return { percentage, color };
        });

        // Update colors state once after all colors have been determined
        setColors(newColors);

        return percentages;
    }


    console.log("colors", colors);


    return (
        <View style={styles.screen}>

            <View style={{flexDirection:'column', gap:15}}>
                <Text style={styles.htext}>Spending</Text>

                <DropDown
                    selectedIndex={selectedIndex}
                    setSelectedIndex={setSelectedIndex}
                />


                
                
                {
                    chartData && chartData.length > 0 && (
                        <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                            <Pie
                                radius={80}
                                innerRadius={50}
                                sections={chartData}
                                strokeCap={'butt'}
                            />
                        </View>
                    )
                }








            </View>


            <View style={styles.storeList}>
                {
                    Object.keys(store2total).map((storeName, index) => (
                        
                        <View key={storeName} style={styles.rowButton}>
                            <View style={{ borderBottomColor: colors[index], borderBottomWidth: 2 }}>
                                <Text style={{ textAlign: 'left', fontSize: 30, fontWeight: '600' }} >{storeName}:</Text>
                            </View>
                            <View style={{ borderBottomColor: colors[index], borderBottomWidth: 2 }}>
                                <Text style={{ textAlign: 'right', fontSize: 30 }}>${formatPrice(store2total[storeName])}</Text>
                            </View>

                        </View>
                    ))
                }
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

export default Location;
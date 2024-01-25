import React, { useState, useCallback, useEffect } from 'react';

import { 
    View, 
    StyleSheet, 
    Text, 
    Alert, 
    Linking, 
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Pressable,
    Image, 
    TouchableWithoutFeedback
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from './TabBarVisibilityContext';




function HomePage({route}) {

    const { shouldFetchTotal, setShouldFetchTotal } = useGlobalContext()
    const [totalSpend, setTotalSpend] = useState(null)

    const IP = route.params.IP;




    const formatDate = () => {
        const date = new Date().toDateString()

        let d = date.split(" ")
        console.log(d);
        let newDate = ''
        index = 0
        for (let item of d) {
            if (index === 2 && item.startsWith("0")) item = item.substring(1, 2)

            if (index < 1) newDate += item
            else newDate += " " + item

            if (index === 0) newDate += ","

            index++;
        }

        return newDate;
    }

    const navigation = useNavigation();



    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            padding: 20,
            flexDirection: 'column',
        },
        buttonContainer: {

            marginBottom: 60, // Space at the bottom
            
            // borderRadius: 10,
            // borderWidth: 2,
            // borderColor: 'inherit',
            width:200,
            alignSelf:'center',
            justifyContent:'space-between',
            // gap:20,
        },
        buttonStyle: {
            margin:20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#77c3ec',
            backgroundColor: 'pink',



        },
        buttonText: {
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf:'center', 
            margin:15
        },
    });


    useEffect( () => {
        getCurrentMonthsTotalSpend()
        formatTotalSpend()
        

    })

    useEffect( () => {
        formatTotalSpend()
    }, [totalSpend])



    const queryDb = async () => {
        fetch(`http://${IP}:5001/get-receipt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Receipts:', data);

                // Here you can do something with the received data
            })
            .catch(error => {
                console.error('There was an error fetching the total', error);
            });
        
    }

    const getCurrentMonthsTotalSpend = async () => {


        try {
            const response = await fetch(`http://${IP}:5001/get-current-months-totals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log(data);
            console.log("we out here");
            setTotalSpend(data.total_spent)
            
        } 
        catch (error) {
            console.error('There was an error fetching the receipts:', error);
        }

        // data = null;

        // fetch(`http://${IP}:5001/get-current-months-totals`)
        // .then(response => {
        //         if (!response.ok) {
        //             throw new Error(`HTTP error! status: ${ response.status }`);
        //         }
        //         return response.json();
        //     })
        //     .then(data => {
        //         console.log('Total:', data);



        //     })
        //     .catch(error => {
        //         console.error('There was an error fetching the totals:', error);
        //     });         
    }

    const formatTotalSpend = () => {
        if (totalSpend){
            let spend = String(totalSpend).split(".");
            console.log(spend[1].length);

            if (spend[1].length < 1) {
                spend[1] += "0"

            }

            return `$${spend[0]}.${spend[1]}`
        }
        else{
            return "$0"
        }

        
    }



    return (
        <View style={style.container}>

            <View style={{
                display:'flex',
                alignItems:"flex-start",
                marginTop:60,
            }}>
                <Text style={{
                    fontSize:90, 
                    fontWeight:'400',
                    fontFamily:'monospace'
                }}>Hi User</Text>
                <Text style={{
                    fontSize: 30,
                    fontWeight: '300',
                }}>{formatDate()}</Text>

                <View>
                    <Text>{formatTotalSpend()}</Text>
                </View>
            </View>



            

        </View>
    );
}

export default HomePage;

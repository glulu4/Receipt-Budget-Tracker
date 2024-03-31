import { Text, View, StyleSheet, TouchableOpacity, LogBox } from 'react-native'
import React, {useState, useEffect} from 'react'



const styles = StyleSheet.create({
    screen: {
        margin: 10,
        flex: 1,

    },
    htext: {
        textAlign: 'center',
        // fontFamily:'Barlow Condensed Black',
        // color:'blue',
        fontSize: 60,
        fontWeight: '400'

    },
    storeList: {
        // flex:1, // this is needed bruh
        // display:'flex',
        margin: 40,
        // alignItems: 'center'
    },

    rowButton: {



        // backgroundColor: 'white',
        // borderRadius: 5,
        flexDirection: 'row',
        justifyContent:'space-between',

        marginVertical:10,
    }
})

const Location = ({ navigation, route }) => {

    const backendAddress = route.params?.backendAddress;

    const [store2total, setStore2Total] = useState({})




    useEffect(() => {

        try {
            getStoreTotals()
        } catch (error) {
            console.log("No stores yet")
            setStore2Total({});
        }
        

        console.log("store2total", store2total);

    }, [])


    const getStoreTotals = async () => {
        try {
            const response = await fetch(`${backendAddress}/get-store-totals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            // console.log('Stores:', data);
            setStore2Total(data); // Return the data for use with await

            
        } catch (error) {
            console.error('There was an error fetching the stores:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    }


    return (
        <View style={styles.screen}>
            {/* <View>
                <Text>Spending</Text>
            </View> */}
            <Text style={styles.htext}>Spending</Text>

            <View style={styles.storeList}>
                {
                    Object.keys(store2total).map(storeName => (
                        <View key={storeName} style={styles.rowButton}>
                            <Text style={{textAlign:'left', fontSize:30, fontWeight:'600'}} >{storeName}:</Text>
                            <Text style={{ textAlign: 'right', fontSize: 30 }}>${store2total[storeName]}</Text>
                        </View>
                    ))
                }
            </View>
            


        </View>
    )

}

export default Location;

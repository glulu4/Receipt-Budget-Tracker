import React, { useState, useCallback, useEffect, useRef } from 'react';

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
    TouchableWithoutFeedback,
    Animated,
    Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useGlobalContext } from './TabBarVisibilityContext';

import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


// const fadeAnim = useRef(new Animated.Value(0)).current;  // Initial value for opacity: 0



function HomePage({ route, navigation }) {

    const { shouldFetchTotal, setShouldFetchTotal, currentUser, setCurrentUser, isSignIn, setIsSignIn } = useGlobalContext()
    const [totalSpend, setTotalSpend] = useState(0);
    const [totalOunces, setTotalOunces] = useState(0);
    const [taxableOz, setTaxableOz] = useState(0);



    console.log("yo", currentUser)

    // const [renderMsg, setRenderMsg] = useState(route.params.renderMessage)



    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();

    const backendAddress = route.params.backendAddress;

    console.log("backendAddress", backendAddress);



    const months = ['January', 'February', 'March',
        'April', 'May', 'June', 'July',
        'August', 'September', 'October', 'November', 'December'];



    const fadeAnim = useRef(new Animated.Value(1)).current;

    const center = (Dimensions.get('screen').width) / 3



    useEffect(() => {
        setIsTabBarVisible(true)

        getCurrentMonthsTotalSpend()
        formatTotalSpend()


    },[])

    useEffect(() => {
        formatTotalSpend()
    }, [totalSpend])








    const formatDate = () => {
        const date = new Date().toDateString()

        let d = date.split(" ")
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

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            padding: 20,
            flexDirection: 'column',
            margin: 20,
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
        successModal: {
            position: 'absolute',
            top: '50%', // center vertically
            left: '50%',
            transform: [{ translateX: -80 }, { translateY: -50 }], // adjust for exact centering
            backgroundColor: '#f9f9f9',

            padding: 20, // adjust as needed
            borderRadius: 10, // rounded corners

            // backgroundColor:'blue',


            zIndex: 10,
            opacity: fadeAnim,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
        },
        screen: {
            flex: 1,
            margin: 10,
            alignItems: 'center',

        },
        header: {
            fontSize: 25,
            textAlign: 'center',
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
            // alignSelf: 'center',
            margin: 15,
            marginLeft: 20,
            textAlign: 'left'
        },
        icon: {
            marginTop: 50
        },

        displayBox:{
            flex:0.5,
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowOffset: {
                width: 10,
                height: 10,
            },
            backgroundColor: '#EACBD2',
            borderRadius: 5,
            height:120,
            width:120
        },
        expenseBox:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center', 


        },
        boxTitle:{
            display: 'flex', 
            flexDirection: 'row', 
            flex: 1, 
        }, 
        nameStyle:{
            fontSize: 95,
            fontWeight: '400',
        },
        topContainer:{
            display: 'flex',
            alignItems: "flex-start",




            position: 'absolute',
            top: 0,

        },
        innerDisplayBox:{ 
            display: 'flex', 
            
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'space-around', 
            margin: 20, 
            flex: 1 
        }, 
        innerExpenseBox:{
            flex: 0.6,
            margin: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'space-around',
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowOffset: {
                width: 8,
                height: 8,
            },
            backgroundColor: '#EACBD2',
            borderRadius: 5,
            // marginTop: 30,
            height: 120,
            width: 120,
        }


    });

    














    const getCurrentMonthsTotalSpend = async () => {


        try {
            const response = await fetch(`${backendAddress}/get-current-months-totals`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log("we out here", data);
            let tax_oz = data.total_ounces.taxed_ounces
            let total_oz = data.total_ounces.total_ounces
            let total_spent = data.total_spent

            // console.log("taxed: ", data.total_ounces.taxed_ounces)
            // console.log("total_ounces: ", data.total_ounces.total_ounces)


            setTotalSpend(data.total_spent)
            setTotalOunces(total_oz)
            setTaxableOz(total_oz - tax_oz)

            
        } 
        catch (error) {
            console.error('There was an error fetching the receipts:', error);
        }

     
    }

    const formatTotalSpend = () => {
        if (totalSpend){
            let spend = String(totalSpend).split(".");
            // console.log("spend", spend);
            // console.log(spend[1].length);

            if (spend[1].length < 1) {
                spend[1] += "0"

            }
            else{
                spend[1]= spend[1].substring(0,2)
            }

            return `$${spend[0]}.${spend[1]}`
        }
        else{
            return "$0"
        }

        
    }



    return (
        <SafeAreaView style={styles.container}>

            <View style={styles.topContainer}>
                <Text style={styles.nameStyle}>Hi {currentUser.firstName}</Text>
                <Text style={{
                    fontSize: 40,
                    fontWeight: '300',
                    marginTop:10
                }}>{formatDate()}</Text>


            </View>


            

           

            <View>

                <View style={{display:'flex', flexDirection:'row', justifyContent:'center', gap:30}}>

                    <View style={styles.displayBox}>


                        <View style={styles.innerDisplayBox}>
                            <View style={styles.boxTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Total OZ</Text>

                                <MaterialCommunityIcons name='bottle-soda-classic-outline' size={20}/>
                            </View>
                            <Text style={{ fontWeight: "300", fontSize: 22 }}>{totalOunces} oz</Text>
                        </View>
                        
                    </View>

                    <View style={styles.displayBox}>
                       
                        <View style={styles.innerDisplayBox}>
                            <View style={styles.boxTitle}>
                                <Text style={{ fontWeight: 'bold', fontSize: 20,  }}>Taxable OZ</Text>

                                <MaterialIcons name='money-off' size={20} />
                            </View>
                            <Text style={{ fontWeight: "300", fontSize: 22 }}>{taxableOz} oz</Text>
                        </View>

                    </View>

                </View>
                




                <View style={styles.expenseBox}>
                    <View style={styles.innerExpenseBox}>
                        <View style={{display:'flex', flexDirection:'row', gap:5 }}>
                            <Text style={{ fontSize: 20, textAlign: 'center', fontWeight: 'bold' }}>{months[(new Date()).getMonth()]}'s Expenses</Text>

                            <Ionicons name='cash-outline' size={20}/>
                        </View>
                        <Text style={{ fontWeight: "300", fontSize: 22 }}>{formatTotalSpend()}</Text>

                    </View>
                </View>





                

            </View>





            

        </SafeAreaView>
    );
}

export default HomePage;

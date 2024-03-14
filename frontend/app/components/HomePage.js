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

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';

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



    // console.log("route.params.renderMessage", route.params.renderMessage);

    // useEffect(() => {
    //     if (route.params.renderMessage) {
    //         setRenderMsg(true); // Show the message
    //         fadeAnim.setValue(1); // Reset animation to visible state
    //     }
    // }, [route.params.renderMessage]);

    // useEffect(() => {
    //     // When showSuccessMessage is true, start the fade out animation
    //     if (renderMsg) {
    //         const timer = setTimeout(() => {
    //             fadeOut();
    //         }, 2000);
    //         return () => clearTimeout(timer);
    //     }
    // }, [renderMsg]);

    useEffect(() => {
        setIsTabBarVisible(true)

        getCurrentMonthsTotalSpend()
        formatTotalSpend()


    },[])

    useEffect(() => {
        formatTotalSpend()
    }, [totalSpend])

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 5 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
        }).start(() => {
            setRenderMsg(false)
        });
        
    };






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
        <View style={styles.container}>

            <View style={{
                display:'flex',
                alignItems:"flex-start",
               
                
                
                
                position:'absolute',
                top:0,

            }}>
                <Text style={{
                    fontSize:90, 
                    fontWeight:'400',
                    fontFamily:'monospace'
                }}>Hi {currentUser.firstName}</Text>
                <Text style={{
                    fontSize: 30,
                    fontWeight: '300',
                }}>{formatDate()}</Text>


            </View>

            {/* {renderMsg || route.params.renderMessage
            ? 
            <Animated.View style={styles.successModal}>
                <Text style={{ color: "green", fontSize: 40, textAlign: 'center' }}>Success Message!</Text>
                <Feather name="check" size={24} color="green" />
            </Animated.View>
            
            : console.log("broski")} */}
            

           

            <View>


                {/* below ill have each categories spend total
                    bar chart of each with a nice display, can click on each to expound
                */}

                <Text style={{fontSize: 30}}>Total Oz: {totalOunces} oz</Text>
                <Text style={{ fontSize: 30 }}>Taxable Oz: {taxableOz} oz</Text>
                <Text style={{ fontSize: 30 }}>{months[(new Date()).getMonth()]}'s Expenses: {formatTotalSpend()}</Text>




                

            </View>





            

        </View>
    );
}

export default HomePage;

import React, { useState, useCallback, useEffect, Platform } from 'react';
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



const styles = StyleSheet.create({
    screen: {
        flex: 1,
        margin:10, 
        marginTop:0,
        display:'flex',
        flexDirection:'column',
        justifyContent: 'center',
        // alignContent:'center'
    },
    buttonStyle: {
        margin: 20,
        borderRadius: 10,
        // borderWidth: 2,
        // borderColor: '#77c3ec',
        // backgroundColor: 'pink',

        


    },
    buttonText: {
        color: '#2496ff',
        fontSize: 35,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 20,
        // fontFamily:"Barlow Condensed",
        fontFamily:'Montserrat Bold',
        
        
        
    },
})




export default function SignIn({route, navigation}){


    const { shouldFetchTotal, setShouldFetchTotal, currentUser, setCurrentUser, isSignIn, setIsSignIn } = useGlobalContext()

    const backendAddress = route.params?.backendAddress;




    const goToSignUp = () => {
        navigation.navigate("Q1")
    }

    const goToExistingSignIn = () => {
        navigation.navigate("ExistingSignin")
    }

    const onLogout = () => {

        fetch(`${backendAddress}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {},
        }).then((response) => {
            // console.log(response)
            return response.json();
        })
            // needed because above then returns
            .then((data) => {
                console.log(data);
            })
            .catch((e) => {
                console.log("Error logging out");
                console.log(e);
            });



        setCurrentUser({});
        setIsSignIn(false)



    }

    return (
        <View style={styles.screen}>




            <View style={{
                // justifyContent:'center',
                // flexDirection:'Column',

                alignItems:'center'
            }}>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={goToExistingSignIn}
                >
                    <Text style={styles.buttonText}>Already a User</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={goToSignUp}
                >
                    <Text style={styles.buttonText}>Sign Up</Text>
                </TouchableOpacity>


                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                    <TouchableOpacity style={{ flex: 1, backgroundColor: 'lightgray', borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', }} onPress={onLogout}>
                        <Text style={styles.buttonText}>Logout</Text>
                    </TouchableOpacity>
                </View>

            </View>


        </View>
    )

}
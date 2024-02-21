import React, { useState, useCallback, useEffect } from 'react';
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
        color: 'royalblue',
        fontSize: 30,
        fontWeight: '400',
        alignSelf: 'center',
        margin: 15,
        
    },
})




export default function SignIn({route, navigation}){


    const { shouldFetchTotal, setShouldFetchTotal, currentUser, setCurrentUser, isSignIn, setIsSignIn } = useGlobalContext()

    const IP = route.params?.IP;

    console.log("kb", IP);

    const goToSignUp = () => {
        navigation.navigate("Q1")
    }

    const goToExistingSignIn = () => {
        navigation.navigate("ExistingSignin")
    }

    const onLogout = () => {

        fetch(`http://${IP}:5001/logout`, {
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
                        {/* <AntDesign name="right" size={20} style={{ marginRight: 10 }} /> */}
                    </TouchableOpacity>


                </View>

            </View>

        </View>
    )

}
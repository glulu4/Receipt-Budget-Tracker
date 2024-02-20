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

    const goToSignUp = () => {
        navigation.navigate("Q1")
    }

    const goToExistingSignIn = () => {
        navigation.navigate("ExistingSignin")
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


            </View>

        </View>
    )

}
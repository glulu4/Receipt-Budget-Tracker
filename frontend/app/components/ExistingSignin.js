import React, { useState, useCallback, useEffect } from 'react';
import {
    View,
    SafeAreaView,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    FlatList,
    TextInput,
    Dimensions,

} from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome'

import { useGlobalContext } from './TabBarVisibilityContext';


export default function ExistingSignin({route, navigation}){

    

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [emailBorderColor, setEmailBorderColor] = useState("black")
    const [passwordBorderColor, setPasswordBorderColor] = useState("black")
    const { isSignIn, setIsSignIn, setCurrentUser } = useGlobalContext()

    const [showErrorMsg, setShowErrorMsg] = useState(false)

    const IP = route.params?.IP;

    const { width } = Dimensions.get('window');


    console.log("mio", IP);



    useEffect(() => {

        if (email.length === 0) {
            setEmailBorderColor('black')
            

        }


        if (email.length > 0 && emailBorderColor === "#b33a3a") {
            setEmailBorderColor('#4bb543')

        }

        if (password.length === 0) {
            setPasswordBorderColor('black')
            

        }


        if (password.length > 0 && passwordBorderColor === "#b33a3a") {
            setPasswordBorderColor('#4bb543')

        }



    }, [email, password])
    const handleSubmit = () => {

 

        if ( !email && !password ){
            setEmailBorderColor("#b33a3a") // red
            setPasswordBorderColor("#b33a3a")
            return;
        }

        if (!email && password){
            setPasswordBorderColor('#4bb543')
            setEmailBorderColor("#b33a3a") // red
            return;
        }


        if (email && !password) {
            setPasswordBorderColor("#b33a3a")
            setEmailBorderColor('#4bb543') // red

            return;
        }




        fetch(`http://${IP}:5001/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email, 
                password: password
            }),
        }).then((response) => {
            // console.log("response", response)
            return response.json();
        })
        // needed because above then returns
        .then((result) => {
            console.log("result", result);



            if (result.hasOwnProperty('first_name')) {

                setCurrentUser({
                    firstName: result.first_name,
                    lastName: result.last_name,
                    email: result.email,
                    rName: result.name_of_restaurant
                })


                setIsSignIn(true)
                navigation.navigate("CreatingAccount")


                console.log(result);
            }
            else{
                console.log("result", result);
                setShowErrorMsg(true)
                return;
            }
        })
        .catch((e) => {
            console.log("Error signing in");
            console.log(e);
        });

    }

    const styles = StyleSheet.create({

        screen: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 30,


        },
        emailInput: {
            height: 50,
            margin: 30,
            marginTop: 10,
            borderWidth: 2,

            borderRadius: 10,
            borderColor: emailBorderColor,



        },
        passwordInput:{
            height: 50,
            margin: 30,
            marginTop: 10,
            borderWidth: 2,

            borderRadius: 10,
            borderColor: passwordBorderColor,
        },
        button: {
            marginTop: 20,
            alignSelf: 'center',
            marginBottom:40
        },
        questionText: {
            textAlign: 'left',
            marginLeft: 40,
            marginBottom: 0,
            fontSize: 30,
            fontWeight: '300',
        },
        questionBox: {
            marginBottom: 30
        },
        errorMsg:{
            textAlign:"center",
            fontSize:20,
            color:'#b33a3a'

        }

    })




    return (

        <View style={styles.screen}>

            <View style={styles.questionBox} >
                <Text style={styles.questionText}>Email</Text>

                <TextInput
                    style={styles.emailInput}
                    onChangeText={setEmail}
                    value={email}
                />
            </View>

            <View style={styles.questionBox}>
                <Text style={styles.questionText}>Password</Text>

                <TextInput
                    style={styles.passwordInput}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry={true}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <FontAwesome name="sign-in" size={35} color="#60B2E5" />
            </TouchableOpacity>

            <View>
               { showErrorMsg && <Text style={styles.errorMsg}>Wrong email or password</Text>}
            </View>

 
        </View>

    )

}
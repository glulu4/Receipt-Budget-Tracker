// QuestionPage.js
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';

import { useGlobalContext } from './TabBarVisibilityContext';

// add password strength and ensure length


const QuestionPage = ({ qid, question, onAnswer, nextPage, navigation, responses, route }) => {

    const [answer, setAnswer] = useState('');

    const { isSignIn, setIsSignIn, setCurrentUser } = useGlobalContext()

    const [borderColor, setBorderColor] = useState('black')
    const IP = route.params?.IP;


    const [showErrorMsg, setShowErrorMsg] = useState(false)

    const [errMsg, setErrMsg] = useState("")


    useEffect(() => {

        if (answer.length === 0){
            setBorderColor('black')
            return;

        }


        if (answer.length > 0 && borderColor === "#b33a3a") {
            setBorderColor('#4bb543')
            
        }




    }, [answer])


    const handleSubmit = async () => {

        console.log(IP);

        if (answer.length === 0) {
            setBorderColor('#b33a3a')
            return;
        }
        else{
            setBorderColor('black')

        }

        if (question === "Email" && (!answer.includes("@") || !answer.includes("."))  ){
            console.log("jgv");
            setShowErrorMsg(true)
            setErrMsg("Invalid Email")
            return;

        }


        if (question === "Password" && answer.length < 8){
            setShowErrorMsg(true)
            setErrMsg("Password is not long enough")
            return;
        }
        else {
            setShowErrorMsg(false); // Reset error message when valid
        }




        if (onAnswer) {
            onAnswer(qid, answer);
        }
        
        const updatedResponses = { ...responses, [qid]: answer };



        if (nextPage !== "Q6"){
            navigation.navigate(nextPage, { responses: updatedResponses })

        }
        else{
            fetch(`http://${IP}:5001/create-user`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedResponses),
            }).then((response) => {

                if ( response.ok ){

                    setCurrentUser({
                        firstName: updatedResponses.firstName,
                        lastName: updatedResponses.lastName,
                        email: updatedResponses.email,
                        rName: updatedResponses.restaurantName
                    })


                    setIsSignIn(true)
                    // navigation.navigate("CreatingAccount")
                    

                }
                else{
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // console.log(response)
                return response.json();
            })
            // needed because above then returns
            // result contains data
            .then((result) => {
                console.log(result);
            })
            .catch((e) => {
                console.log("Error adding user");
                console.log(e);
            });




                
        }



    }

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignContent: 'center',
            flexDirection: 'column',

        },
        input: {
            height: 50,
            margin: 40,
            borderWidth: 2,
            padding: 10,
            borderRadius: 10,
            borderColor: borderColor


        },
        button: {
            marginTop: 20,
            alignSelf: 'center'
        },
        questionText: {
            textAlign: 'center',
            marginBottom: 20,
            fontSize: 35,
            fontWeight: '300',
            fontFamily: 'Montserrat',
            fontWeight: '400',
        },
        errorMsg: {
            textAlign: "center",
            fontSize: 20,
            color: '#b33a3a'

        },
        errorBox:{
            margin:20
        }
    });
    

    return (
        <View style={styles.container}>
            <Text style={styles.questionText}>{question}</Text>
            <TextInput
                style={styles.input}
                onChangeText={setAnswer}
                value={answer}
                secureTextEntry={ qid === 'password'}
            />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <AntDesign name="arrowright" size={30} />
            </TouchableOpacity>


            <View style={styles.errorBox}>
                {/* <Text style={styles.errorMsg}>suck it</Text> */}
                {showErrorMsg && <Text style={styles.errorMsg}>{errMsg}</Text>}
            </View>
        </View>
    );


    
};

export default QuestionPage;

import React, { useState } from 'react';
import {
    View,
} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import QuestionPage from './QuestionPage';

const Q4 = ({ navigation, route }) => {


    // Initialize responses state. If coming back to Q1, consider initializing with existing responses
    const [responses, setResponses] = useState(route.params?.responses || {});

    const handleResponse = (questionId, response) => {
        // Update the responses state with the new answer
        setResponses(prevResponses => ({
            ...prevResponses,
            [questionId]: response,
        }));

    };

    return (
        <View style={{
            margin: 10,
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
        }}>
            <QuestionPage
                qid="email"
                question="Email"
                onAnswer={handleResponse} 
                nextPage="Q5"
                navigation={navigation} 
                responses={responses} 
                route={route}
            />
        </View>
    );
};

export default Q4;

import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useGlobalContext } from './TabBarVisibilityContext';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default function AccountLoading({navigation}){



    const { isSignIn, setIsSignIn } = useGlobalContext();
    // setIsUserSignedIn(true);

    console.log("isSignIn from lo", isSignIn);
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsSignIn(true);
            // No need to navigate here if setting isUserSignedIn triggers the app to show the main tabs/stack
        }, 2000);
        return () => clearTimeout(timer);
    }, []);


    return ( 
        <View style={styles.container}>
            <ActivityIndicator size="large" color="black" />
        </View>
    )
}
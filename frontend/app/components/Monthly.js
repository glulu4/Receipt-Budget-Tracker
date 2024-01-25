import { Text, View, StyleSheet } from 'react-native'
import React from 'react'


const Monthly = () => {



    const styles = StyleSheet.create({

        screen: {
            flex:1,
            justifyContent:"space-around", // column
            alignItems:'center', // row
            // marginTop:80,
        }, 
        title: {
            fontSize: 60,
            fontWeight: '400',
            fontFamily: 'monospace'
        }

    })


    return (
        <View style={styles.screen}>
            <Text style={styles.title}>Monthly</Text>
        </View>
    )

}
export default Monthly;


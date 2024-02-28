import { Text, View, StyleSheet } from 'react-native'
import React from 'react'


const Settings = () => {


    const styles = StyleSheet.create({
        screen: {
            margin:10,
            flex: 1,

        },
        htext:{
            textAlign:'center',
            fontFamily:'Barlow Condensed Black',
            fontSize:60,
            fontWeight:'400'

        }
    })

    return (
        <View style={styles.screen}>
            <Text style={styles.htext}>Settings</Text>
        </View>
    )

}

export default Settings;
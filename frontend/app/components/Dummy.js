import React, {useEffect} from 'react'

import { View, Text, TouchableOpacity } from 'react-native'
import { useGlobalContext } from './TabBarVisibilityContext';

export default function Dummy({navigation}){



    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();



    return (
        <View>
            <Text>Hi</Text>

            <TouchableOpacity onPress={() => {
                // setIsTabBarVisible(true)
                navigation.navigate("MonthlyScreen")
                
                }}>
                <Text>Go back bitch</Text>
            </TouchableOpacity>
        </View>
    )
}
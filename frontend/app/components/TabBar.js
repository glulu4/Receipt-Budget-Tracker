import { StyleSheet, View } from 'react-native';
import React from 'react';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarComponent from './TabBarComponent';
import { useGlobalContext } from './TabBarVisibilityContext';

const TabBar = ({ state, navigation, descriptors }) => {

    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();

    const styles = StyleSheet.create({
        tabBarStyle: {
            backgroundColor: 'white',
            flexDirection: 'row',
            position: 'absolute',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 20,
            bottom: 40, // here you can use the bottom inset for more flexbility
            left: 20,
            right: 20,
            height: 60,
            flex: 1,
            elevation: 0,
            borderRadius: 15,
            shadowColor: '#000000',
            shadowOpacity: 0.05,
            shadowOffset: {
                width: 10,
                height: 10,
            },

            zIndex:3,
        },
    });

    return (

        <>
            {isTabBarVisible && (<View style={styles.tabBarStyle}>
                <TabBarComponent
                    state={state}
                    navigation={navigation}
                    descriptors={descriptors}
                />
            </View>)}
        </>

    );
};

export default TabBar;


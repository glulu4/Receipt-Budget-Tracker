import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './components/HomePage';
import Receipt from './components/Receipt';
import CameraPage from './components/CameraPage';
import Loading from './components/Loading';
import DataDisplay from './components/DataDisplay';

import Settings from './components/Settings';
import Profile from './components/Profile';
import Monthly from './components/Monthly';

import ReceiptDisplay from './components/ReceiptDisplay';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './components/TabBar';

import { TabBarVisibilityProvider } from './components/TabBarVisibilityContext';

function App() {

    // const ip = '10.0.0.155'; // home 
    // const ip = '10.0.0.153'; // aba 

    const ip = '192.168.5.122' // kennet 
    // const ip = '10.4.34.154' // cathy
    
    // const ip = '10.215.231.46' // panera 

    // const ip = '10.0.0.153' // ellie b

    // const ip = '192.168.1.210' // chabad

    // const ip = '10.5.46.147'; // lawrence

    // const ip = '10.4.75.248' // cathy 2
    const HomeStack = createNativeStackNavigator();
    const ProfileStack = createNativeStackNavigator();
    const SettingsStack = createNativeStackNavigator();
    const MonthlyStack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();



    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomePage" component={HomePage} initialParams={{ IP: ip }}/>
                <HomeStack.Screen name="Receipts" component={Receipt} />

                <HomeStack.Screen name="Camera-Page" component={CameraPage} screenOptions={{ gestureEnabled: false, headerShown: false }} />
                <HomeStack.Screen name="Loading-Page" component={Loading} initialParams={{IP: ip}} />
                {/* <HomeStack.Screen name="Loading-Page" component={(props) => <Loading {...props} IP={ip} />} /> */}

                {/* <HomeStack.Screen name="DataDisplayPage" component={(props) => <DataDisplay {...props} IP={ip} />} /> */}

                <HomeStack.Screen name="DataDisplayPage" component={DataDisplay} initialParams={{ IP: ip }} />
            </HomeStack.Navigator>
        );
    }
    function MonthlyStackScreen() {
        return (
            <MonthlyStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
                <MonthlyStack.Screen name="MonthlyScreen" component={Monthly} initialParams={{ IP: ip }} options={{
                    gestureEnabled: false, // Disable swipe back gesture
                }} />
                <MonthlyStack.Screen name="ReceiptDisplay" component={ReceiptDisplay} initialParams={{ IP: ip }} />

                {/* other screens in the profile stack */}
            </MonthlyStack.Navigator>
        );
    }

    function SettingsStackScreen() {
        return (
            <SettingsStack.Navigator screenOptions={{ headerShown: false }}>
                <SettingsStack.Screen name="SettingsScreen" component={Settings} />
                {/* other screens in the profile stack */}
            </SettingsStack.Navigator>
        );
    }

    function ProfileStackScreen() {
        return (
            <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
                <ProfileStack.Screen name="ProfilePage" component={Profile} />
                {/* other screens in the profile stack */}
            </ProfileStack.Navigator>
        );
    }


    return (
        <TabBarVisibilityProvider>
            <NavigationContainer>
                <Tab.Navigator initialRouteName='Home' screenOptions={{
                    title: 'My home',
                    headerStyle: {
                        backgroundColor: 'pink',
                    },

                }} tabBar={props => <TabBar {...props} />}>
                    <Tab.Screen name="Home" component={HomeStackScreen} />
                    <Tab.Screen name="Monthly" component={MonthlyStackScreen} />
                    <Tab.Screen name="Settings" component={SettingsStackScreen} />
                    <Tab.Screen name="Profile" component={ProfileStackScreen} />
                </Tab.Navigator>
            </NavigationContainer>
        </TabBarVisibilityProvider>

    );




}

export default App;
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomePage from './components/HomePage';
// import Receipt from './components/Receipt';
import CameraPage from './components/CameraPage';
import Loading from './components/Loading';
import DataDisplay from './components/DataDisplay';

import Settings from './components/Settings';
import Profile from './components/Profile';
import Monthly from './components/Monthly';

import Dummy from './components/Dummy';

import ReceiptDisplay from './components/ReceiptDisplay';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './components/TabBar';

import SignIn from './components/SignIn';
import Q1 from './components/Q1';
import Q2 from './components/Q2';
import Q3 from './components/Q3';
import Q4 from './components/Q4';
import Q5 from './components/Q5';
import AccountLoading from './components/AccountLoading'

import ExistingSignin from './components/ExistingSignin';

import { TabBarVisibilityProvider } from './components/TabBarVisibilityContext';

import { useGlobalContext } from './components/TabBarVisibilityContext';

function App() {

    // const ip = '10.0.0.155'; // home 
    // const ip = '10.0.0.153'; // aba 

    // const ip = '192.168.5.122' // kennet 
    // const ip = '10.4.34.154' // cathy

    // const ip = '10.215.231.46' // panera 

    // const ip = '10.0.0.153' // ellie b

    // const ip = '192.168.1.210' // chabad

    // const ip = '10.5.46.147'; // lawrence

    const ip = '10.215.142.252' // cathy 2


    // const ip = '10.5.64.143' // WPU
    
    const HomeStack = createNativeStackNavigator();
    const ProfileStack = createNativeStackNavigator();
    const SettingsStack = createNativeStackNavigator();
    const MonthlyStack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    const SignInStack = createNativeStackNavigator();
    const RootStack = createNativeStackNavigator();


    const { isSignIn, setIsSignIn } = useGlobalContext()

    function SignInScreen(){
        return ( 
            <SignInStack.Navigator screenOptions={{ headerShown: false }} >
                <SignInStack.Screen name="InitSignIn" component={SignIn} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="Q1" component={Q1} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="Q2" component={Q2} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="Q3" component={Q3} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="Q4" component={Q4} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="Q5" component={Q5} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="CreatingAccount" component={AccountLoading} initialParams={{ IP: ip }} />
                <SignInStack.Screen name="ExistingSignin" component={ExistingSignin} initialParams={{ IP: ip }} />
            </SignInStack.Navigator>
        )
    }

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomePage" component={HomePage} initialParams={{ IP: ip }} />
                {/* <HomeStack.Screen name="Receipts" component={Receipt} /> */}

                <HomeStack.Screen name="CameraPage" component={CameraPage} screenOptions={{ gestureEnabled: false, headerShown: false }} />
                <HomeStack.Screen name="LoadingPage" component={Loading} initialParams={{ IP: ip }} />
                <HomeStack.Screen name="DataDisplayPage" component={DataDisplay} initialParams={{ IP: ip }} />
            </HomeStack.Navigator>
        );
    }
    function MonthlyStackScreen() {
        return (
            <MonthlyStack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }} >
                <MonthlyStack.Screen name="MonthlyScreen" component={Monthly} initialParams={{ IP: ip }} options={{
                    gestureEnabled: false, // Disable swipe back gesture
                }} />
                {/* <MonthlyStack.Screen name="ReceiptDisplay" component={ReceiptDisplay} initialParams={{ IP: ip }} />

                <MonthlyStack.Screen name="Dummy" component={Dummy} initialParams={{ IP: ip }} /> */}
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
                <ProfileStack.Screen name="ProfilePage" component={Profile} initialParams={{ IP: ip }} />
                {/* other screens in the profile stack */}
            </ProfileStack.Navigator>
        );
    }


    console.log("isSignInp", isSignIn);


    const MainApp = () => {
        return (
            <Tab.Navigator 
                initialRouteName="Home" 
                screenOptions={{ headerShown: false, gestureEnabled: false }}
            //     screenOptions={{
            //         title: 'My home',
            //         headerStyle: {
            //         backgroundColor: 'pink',
            //     },
            // }} 
            tabBar={props => <TabBar {...props} />}>
                <Tab.Screen name="Home" component={HomeStackScreen} />
                <Tab.Screen name="Monthly" component={MonthlyStackScreen} />
                <Tab.Screen name="Settings" component={SettingsStackScreen} />
                <Tab.Screen name="Profile" component={ProfileStackScreen} />

            </Tab.Navigator>
        )
    }


    return (
        <NavigationContainer>
            <RootStack.Navigator screenOptions={{
                gestureEnabled: false,
                headerShown: isSignIn, 
                title: 'My home', 
                headerStyle: {
                    backgroundColor: 'pink',
                },
                 }}>
                {isSignIn ? (
                    <>
                        <RootStack.Screen name="MainApp" component={MainApp} initialParams={{ IP: ip }} />
                        <RootStack.Screen name="LoadingPage" component={Loading} initialParams={{ IP: ip }} />
                        <RootStack.Screen name="CameraPage" component={CameraPage} initialParams={{ IP: ip }} />
                        <RootStack.Screen name="DataDisplayPage" component={DataDisplay} initialParams={{ IP: ip }}   />

                        <RootStack.Screen name="ReceiptDisplay" component={ReceiptDisplay} initialParams={{ IP: ip }} />

                        <RootStack.Screen name="Dummy" component={Dummy} initialParams={{ IP: ip }} />
                        {/* <RootStack.Screen name="HomePage" component={HomePage} initialParams={{ IP: ip }} /> */}
                        {/* Other global screens can be added here */}
                    </>
                ) : (
                        <RootStack.Screen name="SignIn" component={SignInScreen} initialParams={{ IP: ip }}/>
                )}
            </RootStack.Navigator>
        </NavigationContainer>
    );



}

export default App;
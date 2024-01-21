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

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import TabBar from './components/TabBar';



function App() {

    const Stack = createNativeStackNavigator();

    const HomeStack = createNativeStackNavigator();

    const ProfileStack = createNativeStackNavigator();

    const SettingsStack = createNativeStackNavigator();

    const MonthlyStack = createNativeStackNavigator();

    const Tab = createBottomTabNavigator();

    function HomeStackScreen() {
        return (
            <HomeStack.Navigator screenOptions={{ headerShown: false }}>
                <HomeStack.Screen name="HomePage" component={HomePage} />
                <HomeStack.Screen name="Receipts" component={Receipt} />
                <HomeStack.Screen name="Camera-Page" component={CameraPage} />
                <HomeStack.Screen name="Loading-Page" component={Loading} />
                <HomeStack.Screen name="DataDisplayPage" component={DataDisplay} />
            </HomeStack.Navigator>
        );
    }
    function MonthlyStackScreen() {
        return (
            <MonthlyStack.Navigator screenOptions={{ headerShown: false }}>
                <MonthlyStack.Screen name="MonthlyScreen" component={Monthly} />
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
        <NavigationContainer>
            <Tab.Navigator initialRouteName='Home' screenOptions={{ headerShown: false }} tabBar={TabBar}>
                <Tab.Screen name="Home" component={HomeStackScreen} />
                <Tab.Screen name="Profile" component={ProfileStackScreen} />
                <Tab.Screen name="Settings" component={SettingsStackScreen} />
                <Tab.Screen name="Monthly" component={MonthlyStackScreen} />

            </Tab.Navigator>
        </NavigationContainer>
    );




}

export default App;
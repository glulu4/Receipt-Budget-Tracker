import { Dimensions, Pressable, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import Animated, {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

// import { AntDesign, Ionicons } from 'react-native-vector-icons';
// import AntDesign from 'react-native-vector-icons/Ionicons';


export const routes = {
    home: { name: 'Home', icon: 'home', type: 'AntDesign' },
    feed: { name: 'Profile', icon: 'receipt-outline', type: 'Ionicons' },
    profile: { name: 'Settings', icon: 'user', type: 'AntDesign' },
    settings: { name: 'Monthly', icon: 'settings', type: 'AntDesign' },
};

const TabBarComponent = ({ state, navigation, descriptors }) => {

    

    // console.log("icon", Icon);


    const { width } = Dimensions.get('window');

    // 20 on each side for absolute positioning of the tab bar
    // 20 on each side for the internal padding
    const TAB_WIDTH = (width - 40 * 2) / 4;

    const translateX = useSharedValue(0);
    const focusedTab = state.index;

    const handleAnimate = (index) => {
        'worklet';
        translateX.value = withTiming(index * TAB_WIDTH, {
            duration: 1000,
        });
    };
    useEffect(() => {
        runOnUI(handleAnimate)(focusedTab);
    }, [focusedTab]);

    const rnStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const styles = StyleSheet.create({
        container: {
            width: TAB_WIDTH,
            height: 40,
            backgroundColor: 'blue',
            zIndex: 0,
            position: 'absolute',
            marginHorizontal: 20,
            borderRadius: 20,
        },
        item: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    const renderIcon = (name, isFocused) => {



        const color = isFocused ? '#A9A9A9' : 'black';
        const size = 24;
        const i = <AntDesign name="home" type="AntDesign" size={30} color="#900" /> // Defaults to regular
        console.log(i);
        switch (name) {
            
            case 'settings':
                return i;
            case 'monthly':
                return i;
            case 'profile':
                return i;
            case 'home':
                return i;
            default:
                return null;
        }
    };

    return (
        <>
            <Animated.View style={[styles.container, rnStyle]} />
            {state.routes.map((route, index) => {
                console.log(route);
                const { options } = descriptors[route.key];

                const label =
                    options.tabBarLabel !== undefined
                        ? options.tabBarLabel
                        : options.title !== undefined
                            ? options.title
                            : route.name;



                const isFocused = (state.index === index);

                const onPress = () => {
                    const event = navigation.emit({
                        type: 'tabPress',
                        target: route.key,
                        canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate({
                            name: route.name,
                            merge: true,
                            params: {},
                        });
                    }
                };

                const onLongPress = () => {
                    navigation.emit({
                        type: 'tabLongPress',
                        target: route.key,
                    });
                };
                const routeName = route.name.toLowerCase();

                console.log("routeName", routeName);
                // const icon = routes[routeName]?.icon;
                return (
                    <Pressable
                        key={`route-${index}`}
                        accessibilityRole="button"
                        accessibilityState={isFocused ? { selected: true } : {}}
                        
                        accessibilityLabel={options.tabBarAccessibilityLabel}
                        testID={options.tabBarTestID}

                        onPress={onPress}
                        onLongPress={onLongPress}
                        style={styles.item}
                    >
                        {/* {<AntDesign name="telescope-outline" size={30} color="pink" /> } */}
                        {/* {renderIcon(routeName, isFocused)} */}

                    </Pressable>
                );
            })}
        </>
    );
};

export default TabBarComponent;

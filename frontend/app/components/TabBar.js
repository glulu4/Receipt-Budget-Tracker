import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import TabBarComponent from './TabBarComponent';


import React, { useEffect, useState, useCallback } from 'react';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'react-native-image-picker';
import { useGlobalContext } from './TabBarVisibilityContext';


import { 
    Dimensions, 
    TouchableOpacity, 
    View, 
    SafeAreaView, 
    Image, 
    // Animated, 
    StyleSheet, 
    Pressable, 
    Modal, 
    TouchableWithoutFeedback, 
    Text
} from 'react-native';
import Animated, {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Camera } from 'react-native-vision-camera';

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';

const ImagePickerModal = ({ isVisible, onClose, onImageLibraryPress, onCameraPress }) => {

    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'flex-end',
            margin: 0,
            height: 10
        },
        buttonIcon: {
            width: 30,
            height: 30,
            margin: 10,
        },
        buttons: {
            backgroundColor: 'lightgray',
            flexDirection: 'row',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
        },
        button: {
            flex: 1,
            justifyContent: 'center',
            marginTop: 15,
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        centeredView: {
            flex: 1,
            justifyContent: 'flex-end', // Align content to the bottom
            alignItems: 'center',
        },
    });
    return (



        <Modal
            animationType="slide"
            transparent={true}
            isVisible={isVisible}
            onBackButtonPress={onClose}
            onBackdropPress={onClose}
        >
            <TouchableWithoutFeedback onPress={() => {

                onClose();

            }}>
                <View style={styles.centeredView}>
                    <SafeAreaView style={styles.buttons}>
                        <Pressable style={styles.button} onPress={onImageLibraryPress}>
                            <FontAwesome name="photo" size={30} />
                            {/* <Image style={styles.buttonIcon} source={img} /> */}
                            <Text style={styles.buttonText}>Library</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={onCameraPress}>
                            <Feather name='camera' size={30} />
                            {/* <Image style={styles.buttonIcon} source={cam} /> */}
                            <Text style={styles.buttonText}>Camera</Text>
                        </Pressable>
                    </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>

    );
}




const TabBar = ({ state, navigation, descriptors }) => {
    const { isTabBarVisible, setIsTabBarVisible } = useGlobalContext();
    const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);

    const { width } = Dimensions.get('window');
    const TAB_WIDTH = (width - 40 * 2) / 4;
    const translateX = useSharedValue(0);
    const focusedTab = state.index;
    const center = (Dimensions.get('window').width) / 2


    const rnStyle = useAnimatedStyle(() => {
        return {
            transform: [{ translateX: translateX.value }],
        };
    });

    const handleAnimate = (index) => {
        'worklet';
        translateX.value = withTiming(index * TAB_WIDTH, {
            duration: 500,
        });
    };
    useEffect(() => {
        runOnUI(handleAnimate)(focusedTab);
    }, [focusedTab]);



    // Tab bar and button styles
    const styles = StyleSheet.create({
        // Styles as before
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

            zIndex: 3,
        },
        modal: {
            justifyContent: 'flex-end',
            margin: 0,
            height: 10
        },
        buttonIcon: {
            width: 30,
            height: 30,
            margin: 10,
        },
        buttons: {
            backgroundColor: 'lightgray',
            flexDirection: 'row',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
        },
        button: {
            flex: 1,
            justifyContent: 'center',
            marginTop: 15,
            alignItems: 'center',
        },
        buttonText: {
            fontSize: 14,
            fontWeight: '600',
        },
        centeredView: {
            flex: 1,
            justifyContent: 'flex-end', // Align content to the bottom
            alignItems: 'center',
        },
        container: {
            width: TAB_WIDTH,
            height: 40,
            backgroundColor: 'pink',
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

        scanButton: {
            position: 'absolute',
            bottom: 35, // Adjust this value as needed
            right: center - 50,

            width: 60, // Diameter of the circle
            height: 60, // Diameter of the circle
            borderRadius: 30, // Half of width/height to make it a circle
            backgroundColor: 'rgb(247, 90, 108)', // Replace with your desired color
            justifyContent: 'center',
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.3,
            shadowRadius: 2,
            elevation: 5,
        },
    });

    // Function to handle image library access
    const onImageLibraryPress = () => {
        const options = {
            selectionLimit: 3,
            mediaType: 'photo',
            includeBase64: false,
            quality: 0.6,
        };

        ImagePicker.launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('Image picker error: ', response.error);
            } else {
                if (response.assets && response.assets.length > 0) {
                    // Extract URIs from all selected images
                    const imageUris = response.assets.map(asset => asset.uri);
                    // setImageArray(imageUris); // Assuming setSelectedImages can handle an array of URIs
                    console.log(imageUris);

                    const photos = imageUris.map((photo, index) => {
                        return {
                            "path": photo.substring('file://'.length)
                        }

                    })
                    setIsImagePickerVisible(false);
                    setIsTabBarVisible(false);


                    console.log("here, about to nav to loading page");
                    navigation.navigate("LoadingPage", { photos: photos });



                }
            }
        });

    };

    async function getCameraPermission() {
        const permission = await Camera.requestCameraPermission();
        console.log(`Camera permission status: ${permission}`);

        if (permission === 'granted') {
            setIsImagePickerVisible(false);
            setIsTabBarVisible(false);

            navigation.navigate("CameraPage");
        }

        if (permission === 'denied') {
            Alert.alert(
                "Permission Required",
                "This app needs camera permission to function. Please enable it in the settings.",
                [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Settings", onPress: () => Linking.openSettings() }
                ]
            );
        }
    }

    if (!isTabBarVisible) {
        return null;
    }

    const renderIcon = (name, isFocused) => {
        const color = isFocused ? 'black' : 'black';
        const size = 24;
        switch (name) {

            case 'settings':
                return <Ionicons name='settings-outline' size={size} color={color}></Ionicons>;
            case 'monthly':
                return <Ionicons name='receipt-outline' size={size} color={color}></Ionicons>;
            case 'profile':
                return <AntDesign name='user' size={size} color={color} ></AntDesign>;
            case 'home':
                return <AntDesign name='home' size={size} color={color} ></AntDesign>;
            default:
                return null;
        }
    };

    return (

        <>
        {

        isTabBarVisible ?
            <View style={styles.tabBarStyle}>
                <Animated.View style={[styles.container, rnStyle]} />
                {state.routes.map((route, index) => {
                    const { options } = descriptors[route.key];



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
                            {renderIcon(routeName, isFocused)}
                            {/* <Icon name="home" size={30} color="#000" /> */}

                        </Pressable>
                    );
                })}
                <TouchableOpacity style={styles.scanButton} onPress={() => setIsImagePickerVisible(true)} >
                     <MaterialIcons name='receipt' size={26} color="white"></MaterialIcons>
                </TouchableOpacity>

            </View>
            : <></>
            }


            {isImagePickerVisible && (
                <ImagePickerModal
                    isVisible={isImagePickerVisible}
                    onClose={() => setIsImagePickerVisible(false)}
                    onImageLibraryPress={onImageLibraryPress}
                    onCameraPress={getCameraPermission}
                />
            )}
        </>
    );
};

export default TabBar;


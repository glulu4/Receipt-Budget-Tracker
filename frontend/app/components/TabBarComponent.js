import { Dimensions, Pressable, StyleSheet, TouchableOpacity, Text, Modal, TouchableWithoutFeedback, View, SafeAreaView, Image } from 'react-native';
import React, { useEffect, useState, useCallback } from 'react';
import Animated, {
    runOnUI,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import * as ImagePicker from 'react-native-image-picker';
import { TapGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/tapGesture';
import { useCameraPermission, Camera } from 'react-native-vision-camera';

import Feather from 'react-native-vector-icons/Feather';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import { useNavigationState } from '@react-navigation/native';



import { useGlobalContext } from './TabBarVisibilityContext';


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
            marginTop:15,
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
                            <FontAwesome name="photo" size={30}/>
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





const TabBarComponent = ({ state, navigation, descriptors }) => {

    
    const [isImagePickerVisible, setIsImagePickerVisible] = useState(false);
    const [pickerResponse, setPickerResponse] = useState(null);

    const [imageArray, setImageArray] = useState([]);


    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();
    const { width } = Dimensions.get('window');
    const TAB_WIDTH = (width - 40 * 2) / 4;
    const translateX = useSharedValue(0);
    const focusedTab = state.index;
    const handleAnimate = (index) => {
        'worklet';
        translateX.value = withTiming(index * TAB_WIDTH, {
            duration: 500,
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

    const center =( Dimensions.get('window').width) / 2


    const styles = StyleSheet.create({
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
            bottom:35, // Adjust this value as needed
            right: center-50,

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

    const onImageLibraryPress = () => {
        const options = {
            selectionLimit: 3,
            mediaType: 'photo',
            includeBase64: false,
            quality:0.6,
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
                    setImageArray(imageUris); // Assuming setSelectedImages can handle an array of URIs
                    console.log(imageUris);

                    const photos = imageUris.map( (photo, index ) => {
                        return {
                            "path": photo.substring('file://'.length)
                        }

                    })
                    setIsImagePickerVisible(false);
                    setIsTabBarVisible(false);

                    
                    console.log("here, about to nav to loading page");
                    navigation.navigate("LoadingPage",{ photos: photos});

                    // navigation.navigate("Home", {
                    //     screen:"Loading-Page",
                    //     params: { photos: photos },
                    // }
                    // )
                    

                }
            }
        });

    };

 




    // set images here

    // console.log("logg", imageArray);

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

    return (
        
        <>
            {isTabBarVisible &&  (<>
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
                    {/* <Ionicons name='receipt-outline' size={24} color="black"></Ionicons> */}
                    <MaterialIcons name='receipt' size={26} color="white"></MaterialIcons>
                    

                </TouchableOpacity>
        </>)}
  

            {isImagePickerVisible && (<ImagePickerModal
                isVisible={isImagePickerVisible}
                onClose={() => setIsImagePickerVisible(false)}
                onImageLibraryPress={onImageLibraryPress}
                onCameraPress={getCameraPermission}
            />)}
        </>
    );
};

export default TabBarComponent;

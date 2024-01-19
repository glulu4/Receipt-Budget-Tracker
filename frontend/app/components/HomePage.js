import React, { useState, useCallback } from 'react';

import { 
    View, 
    StyleSheet, 
    Text, 
    Alert, 
    Linking, 
    TouchableOpacity,
    Modal,
    SafeAreaView,
    Pressable,
    Image, 
    TouchableWithoutFeedback
} from 'react-native';
import CameraPage from './CameraPage';
import { useNavigation } from '@react-navigation/native';

import { useCameraPermission, Camera } from 'react-native-vision-camera';
import * as ImagePicker from 'react-native-image-picker';

import cam from '../assets/camera.png';
import img from '../assets/image.jpg';




const ImagePickerModal = ({isVisible, onClose, onImageLibraryPress,}) => {

    const styles = StyleSheet.create({
        modal: {
            justifyContent: 'flex-end',
            margin: 0,
            height:10
        },
        buttonIcon: {
            width: 30,
            height: 30,
            margin: 10,
        },
        buttons: {
            backgroundColor: 'white',
            flexDirection: 'row',
            borderTopRightRadius: 30,
            borderTopLeftRadius: 30,
        },
        button: {
            flex: 1,
            justifyContent: 'center',
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
                    <Image style={styles.buttonIcon} source={img} />
                    <Text style={styles.buttonText}>Library</Text>
                </Pressable>
                <Pressable style={styles.button}>
                    <Image style={styles.buttonIcon} source={cam} />
                    <Text style={styles.buttonText}>Camera</Text>
                </Pressable>
            </SafeAreaView>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
       
    );
}

function HomePage() {
    // const IP = '10.0.0.155'; // home 
    // const IP = '10.0.0.153'; // aba 

    // const IP = '192.168.5.122' // kennet 
    // const IP = '10.5.40.176' // cathy
    const IP = '10.215.231.46' // panera 

    const [pickerResponse, setPickerResponse] = useState(null);
    const [visible, setVisible] = useState(false);
    const formatDate = () => {
        const date = new Date().toDateString()

        let d = date.split(" ")
        console.log(d);
        let newDate = ''
        index = 0
        for (let item of d) {
            if (index === 2 && item.startsWith("0")) item = item.substring(1, 2)

            if (index < 1) newDate += item
            else newDate += " " + item

            if (index === 0) newDate += ","

            index++;
        }

        return newDate;
    }






    const navigation = useNavigation();

    async function getPermission() {
        const permission = await Camera.requestCameraPermission();
        console.log(`Camera permission status: ${permission}`);

        if (permission === 'granted') {
            navigation.navigate("Camera-Page");
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

    const style = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'space-between',
            padding: 20,
            flexDirection: 'column',
        },
        buttonContainer: {

            marginBottom: 60, // Space at the bottom
            
            // borderRadius: 10,
            // borderWidth: 2,
            // borderColor: 'inherit',
            width:200,
            alignSelf:'center',
            justifyContent:'space-between',
            // gap:20,
        },
        buttonStyle: {
            margin:20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#77c3ec',
            backgroundColor: 'pink',



        },
        buttonText: {
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf:'center', 
            margin:15
        },
    });


    const queryDb = async () => {




        fetch(`http://${IP}:5001/get-receipt`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Receipts:', data);

                // Here you can do something with the received data
            })
            .catch(error => {
                console.error('There was an error fetching the receipts:', error);
            });
        
    }

    const onImageLibraryPress = useCallback(() => {
        const options = {
            selectionLimit: 3,
            mediaType: 'photo',
            includeBase64: false,
        };
        ImagePicker.launchImageLibrary(options, setPickerResponse);
        setVisible(false);
    }, []);


    const uri = pickerResponse?.assets && pickerResponse.assets[0].uri;
    console.log(uri);

    const uploadImage = () => {
        setVisible(true);
    }

    return (
        <View style={style.container}>

            <View style={{
                display:'flex',
                alignItems:"flex-start",
                marginTop:60,
            }}>
                <Text style={{
                    fontSize:90, 
                    fontWeight:'400',
                    fontFamily:'monospace'
                }}>Hi User</Text>
                <Text style={{
                    fontSize: 30,
                    fontWeight: '300',
                }}>{formatDate()}</Text>
            </View>

            
            <View style={style.buttonContainer}>

                <TouchableOpacity
                    style={style.buttonStyle}
                    onPress={getPermission}
                >
                    <Text style={style.buttonText}>Scan Receipt</Text>
                </TouchableOpacity>

                {/* <TouchableOpacity
                    style={style.buttonStyle}
                    onPress={queryDb}
                >
                    <Text style={style.buttonText}>Get Receipt</Text>
                </TouchableOpacity> */}

                <TouchableOpacity
                    style={style.buttonStyle}
                    onPress={uploadImage}
                >
                    <Text style={style.buttonText}>Upload Image</Text>
                </TouchableOpacity>

                { visible && (<ImagePickerModal
                    isVisible={visible}
                    onClose={() => setVisible(false)}
                    onImageLibraryPress={onImageLibraryPress}
                />)}

                

            </View>
        </View>
    );
}

export default HomePage;

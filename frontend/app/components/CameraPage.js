import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    StyleSheet,
    Button,
    TouchableOpacity,
    Text,
    Linking,
    Image,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { Camera, useCameraDevices, useCameraDevice, useCameraPermission } from 'react-native-vision-camera';



function CameraPage() {
    const navigation = useNavigation();
    const camera = useRef(null);
    const device = useCameraDevice('back')
    const [showCamera, setShowCamera] = useState(true);
    const [imageSource, setImageSource] = useState('');
    const [currPhoto, setCurrPhoto] = useState(null);
    const [photoList, setPhotoList] = useState([]);
    const [finishClicked, setFinishClicked] = useState(false);

    // resets every render, so need to use state 
    // let photoList = [];




    useEffect(() => {
        console.log("The photo list has ", photoList.length, " items");

    },[])

    useEffect( () => {
        if (finishClicked) {
            navigation.navigate("Loading-Page", { photos: photoList });
        }
    }, [finishClicked, photoList ])

    if (device == null) {
        return <Text>Camera not available</Text>;
    }
    
    const capturePhoto = async () => {
        if (camera.current !== null) {
            try {
                const photo = await camera.current.takePhoto({
                    enableAutoStabilization: true,
                    qualityPrioritization: "quality",
                    flash: "auto",
                });
                setCurrPhoto(photo);
                setImageSource(photo.path);
                setShowCamera(false);
            } catch (error) {
                console.error('Error capturing photo:', error);
            }
        }


        
    };

    const addAnother = () => {

        console.log("curr foto in addAnotha: ", currPhoto);

        if ( currPhoto != null ){
            setPhotoList(prevList => [...prevList, currPhoto]);
        }
        retakePhoto();
    };



    const retakePhoto = () => {
        setShowCamera(true);
        setCurrPhoto(null);
    }

    const goBack = () => {
        setCurrPhoto(null);
        setPhotoList(prevList => []);
        setIsTabBarVisible(true);
        navigation.navigate("HomePage");
    }


    const usePhoto = async () => {
        setPhotoList(prevList => [...prevList, currPhoto]);
        setFinishClicked(true); // Update the state when "Finish" is clicked
    };


    return (
        


        <View style={styles.container}>

            {showCamera ?  (
                <>
                    <Camera
                        ref={camera}
                        style={StyleSheet.absoluteFill}
                        device={device}
                        isActive={showCamera}
                        photo={true}
                    />

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={styles.camButton}
                            onPress={() => capturePhoto()}
                        />
                    </View>
                </>
            ) : (
                <>
                    {imageSource !== '' ? (
                        <Image
                            style={styles.image}
                            source={{
                                uri: `file://'${imageSource}`,
                            }}
                        />
                    ) : null }

                    <View style={styles.topButtonContainer}>
                            <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.topButtonStyle}
                                onPress={goBack}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    Back
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.topButtonStyle}
                                onPress={addAnother}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                    Add another
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                    <View style={styles.buttonContainer}>

                        <View style={styles.buttons}>
                            <TouchableOpacity
                                style={styles.retakeButton}
                                onPress={retakePhoto}>
                                <Text style={{ color: '#77c3ec', fontWeight: '500' }}>
                                    Retake
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.usePhotoButton}
                                onPress={usePhoto}>
                                <Text style={{ color: 'white', fontWeight: '500' }}>
                                        { (photoList.length>0) ? 'Finish' : 'Use Photo' }
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </>
            )}

            
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'gray',
    },
    topButtonContainer: {
        backgroundColor: 'rgba(0,0,0,0.0)',
        position: 'absolute',
        justifyContent: 'center',
        width: '100%',
        top: 40,
    },
    buttonContainer: {
        backgroundColor: 'rgba(0,0,0,0.2)',
        position: 'absolute',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        bottom: 0,
        padding: 20,
    },
    buttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    camButton: {
        height: 80,
        width: 80,
        borderRadius: 40,
        //ADD backgroundColor COLOR GREY
        backgroundColor: '#B2BEB5',

        alignSelf: 'center',
        borderWidth: 4,
        borderColor: 'white',
    },
    image: {
        width: '100%',
        height: '100%',
        aspectRatio: 9 / 16,
    },

    retakeButton: {
        backgroundColor: '#fff',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#77c3ec',
    }, 
    usePhotoButton: {
        backgroundColor: '#77c3ec',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: 'white',
    }, 
    topButtonStyle: {
        // backgroundColor: 'rgba(0,0,0,0.2)',
        backgroundColor: '#77c3ec',
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#fff',
        width: 100,


    }
});

export default CameraPage;
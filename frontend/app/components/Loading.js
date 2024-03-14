import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useGlobalContext } from './TabBarVisibilityContext';

import RNFS from 'react-native-fs';

function Loading({ navigation, route }) {


    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();

    const { shouldFetchTotal, setShouldFetchTotal } = useGlobalContext();
    const photos = route.params.photos;
    const backendAddress = route.params.backendAddress;


    console.log("pjoojo", photos );
    console.log("In Loading.js");



    const startUploadSession = async () => {
        setShouldFetchTotal(true);
        const response = await fetch(`${backendAddress}/start-upload-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total: photos.length }),
        });

        const data = await response.json();
        console.log(data);
        return data.session_id;
    };

    // const uploadImage = async (photo, sessionId, index) => {
    //     const binaryData = await RNFS.readFile(photo.path, 'base64');
    //     const binaryBlob = await (await fetch(`data:image/jpeg;base64,${binaryData}`)).blob();
    //     const response = await fetch(`${backendAddress}/upload-image/${sessionId}/${index}`, {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/octet-stream',
    //         },
    //         body: binaryBlob,
    //     });

    //     return await response.json();
    // };

    const uploadImage = async (photo, sessionId, index) => {
        try {
            // Attempt to read the file as a base64-encoded string
            const binaryData = await RNFS.readFile(photo.path, 'base64');

            // Convert the base64 string to a binary blob
            const binaryBlob = await (await fetch(`data:image/jpeg;base64,${binaryData}`)).blob();

            // Attempt to upload the image
            const response = await fetch(`${backendAddress}/upload-image/${sessionId}/${index}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/octet-stream',
                },
                body: binaryBlob,
            });

            // Before parsing the JSON, check if the response was ok
            if (!response.ok) {
                // This will catch HTTP status errors (e.g., 400, 401, 500)
                throw new Error(`Failed to upload image. Status: ${response.status}`);
            }

            // If the response was ok, parse and return the JSON body
            return await response.json();
        } catch (error) {
            // Log the error to the console or handle it as needed
            console.error(`Error uploading image at index ${index}:`, error);

            // Depending on how you want to handle errors, you might throw the error again
            // or return a specific error object to be handled by the caller
            throw error;
        }
    };




    const getStores = async () => {
        try {
            const response = await fetch(`${backendAddress}/get-stores`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            console.log('Stores:', data);
            return data; // Return the data for use with await
        } catch (error) {
            console.error('There was an error fetching the stores:', error);
            throw error; // Rethrow the error to handle it in the calling function
        }
    }
    const processPhotos = async () => {
        try {
            const sessionId = await startUploadSession();

            console.log("created id, id = ", sessionId);
            const uploadPromises = photos.map((photo, index) => uploadImage(photo, sessionId, index));
            console.log("Here1");

            const results = await Promise.all(uploadPromises);
            console.log("Here2");


            console.log("results", results);

            console.log('All uploads complete:');

            storeList = await getStores();


            console.log("inp phot", storeList);
            navigation.navigate('DataDisplayPage', { receiptData: results, storeList: storeList });
        } catch (error) {
            console.log("WE are getting here");
            console.error('Error:', error);
            console.log("Error2", error.stack);
            console.log("Error3", error.name);
            console.log("Error4", error.message);

            console.log("\t" + error.toString());
            setIsTabBarVisible(true);
            navigation.navigate("HomePage");
        }
    };

    useEffect(() => {
        processPhotos();
    }, []);

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
    });

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color="#0000ff" />
        </View>
    );
}

export default Loading;

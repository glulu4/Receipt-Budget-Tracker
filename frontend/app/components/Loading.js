import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useGlobalContext } from './TabBarVisibilityContext';
import { Spinner } from '@ui-kitten/components';


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
        console.log("uploead session data = ", data);
        return data.session_id;
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

    const uploadImage = async (photo, sessionId, index) => {
        const binaryData = await RNFS.readFile(photo.path, 'base64');
        const binaryBlob = await (await fetch(`data:image/jpeg;base64,${binaryData}`)).blob();
        const response = await fetch(`${backendAddress}/upload-image/${sessionId}/${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: binaryBlob,
        });

        return await response.json();
    };

    const processPhotos = async () => {
        try {
            const sessionId = await startUploadSession();

            console.log("created id, id = ", sessionId);
            const uploadPromises = await photos.map((photo, index) => uploadImage(photo, sessionId, index));
            console.log("Here1, promises = ", uploadPromises);

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
            <Spinner status='primary' size='giant' />

            {/* <ActivityIndicator size="large" color="#0000ff" /> */}
        </View>
    );
}

export default Loading;

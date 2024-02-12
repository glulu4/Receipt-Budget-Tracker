import React, { useEffect } from 'react';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { useGlobalContext } from './TabBarVisibilityContext';

import RNFS from 'react-native-fs';

function Loading({ navigation, route }) {
    const photos = route.params.photos;
    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();

    const { shouldFetchTotal, setShouldFetchTotal } = useGlobalContext();

    console.log("pjoo", photos );

    const IP = route.params.IP;

    const startUploadSession = async () => {
        setShouldFetchTotal(true);
        const response = await fetch(`http://${IP}:5001/start-upload-session`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ total: photos.length }),
        });

        const data = await response.json();
        return data.session_id;
    };

    const uploadImage = async (photo, sessionId, index) => {
        const binaryData = await RNFS.readFile(photo.path, 'base64');
        const binaryBlob = await (await fetch(`data:image/jpeg;base64,${binaryData}`)).blob();
        const response = await fetch(`http://${IP}:5001/upload-image/${sessionId}/${index}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/octet-stream',
            },
            body: binaryBlob,
        });

        return await response.json();
    };

    // const getStores = async () => {

    //     fetch(`http://${IP}:5001/get-stores`)
    //         .then(response => {
    //             if (!response.ok) {
    //                 throw new Error(`HTTP error! status: ${response.status}`);
    //             }
    //             return response.json();
    //         })
    //         .then(data => {
                
    //             console.log('Stores:', data);
    //             return data;

    //             // Here you can do something with the received data
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the total', error);
    //         });
    // }

    const getStores = async () => {
        try {
            const response = await fetch(`http://${IP}:5001/get-stores`);
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
            console.log("created id");
            const uploadPromises = photos.map((photo, index) => uploadImage(photo, sessionId, index));
            const results = await Promise.all(uploadPromises);

            console.log('All uploads complete:');

            storeList = await getStores();


            console.log("inp phot", storeList);
            navigation.navigate('DataDisplayPage', { receiptData: results, storeList: storeList });
        } catch (error) {
            console.error('Error:', error);
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

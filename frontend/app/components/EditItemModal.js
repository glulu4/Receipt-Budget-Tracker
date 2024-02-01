
import React, { useState, useEffect } from 'react';
import { useGlobalContext } from './TabBarVisibilityContext';

import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    Button,
    TouchableWithoutFeedback,
    Keyboard,

} from 'react-native';

import SwipeRow from '@nghinv/react-native-swipe-row';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function EditModal({ isVisible, onClose, onSave, item }){
    // Local states for each field in the modal
    const [description, setDescription] = useState(item?.description);
    const [quantity, setQuantity] = useState(item?.quantity?.toString()); // Convert quantity to string for TextInput
    const [numOz, setNumOz] = useState(item?.num_oz?.toString());
    const [caseSize, setCaseSize] = useState(item?.case_size?.toString());



    // Function to handle saving the edited item
    const handleSave = () => {
        // Create an updated item object
        const updatedItem = {
            ...item,
            description,
            quantity: parseInt(quantity, 10), // Convert quantity back to a number
            num_oz: parseInt(numOz, 10),
            case_size: parseInt(caseSize, 10),
        };

        // Call the onSave function passed from the parent component
        onSave(updatedItem);
    };

    // Reset local states when the modal is closed
    useEffect(() => {
        if (!isVisible) {
            setDescription(item?.description);
            setQuantity(item?.quantity.toString());
            setNumOz(item?.numOz);
            setCaseSize(item?.case_size);
        }
    }, [isVisible, item]);


    const styles = StyleSheet.create({

        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22,

        },
        modalView: {

            margin: 20,
            marginTop: 130,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            justifyContent: 'center',
            shadowColor: "#000",
            shadowOffset: {
                width: 0,
                height: 2
            },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
        },
        modalTexHeader: {
            marginBottom: 15,
            textAlign: "center",
            fontSize: 40,
            marginBottom: 40,
        },
        modalInput: {
            // width: 250,
            height: 50,
            marginBottom: 12,
            borderWidth: 1,
            padding: 10
        },
    })

    return (

        <Modal
            animationType="slide"
            transparent={true}
            visible={isVisible}
            onRequestClose={onClose}
        >

            <TouchableWithoutFeedback onPress={() => {

                onClose();

            }}>

                <View style={styles.centeredView}>
                    <ScrollView scrollEnabled={false}>
                        <View style={styles.modalView}>

                            <View>

                                <Text style={styles.modalTexHeader}>Edit {item.description}</Text>



                                <Text>Description:</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    onChangeText={setDescription}
                                    value={description}
                                    placeholder="Description"
                                />

                                <Text>Quantity:</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    onChangeText={setQuantity}
                                    value={quantity}
                                    keyboardType="numeric"
                                    placeholder="Quantity"
                                />





                                <Text>Item Size Ounces:</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    onChangeText={setNumOz}
                                    value={numOz}
                                    keyboardType="numeric"
                                    placeholder="Item Size"
                                />

                                <Text>Case Size:</Text>
                                <TextInput
                                    style={styles.modalInput}
                                    onChangeText={setCaseSize}
                                    value={caseSize}
                                    keyboardType="numeric"
                                    placeholder="Case Size"
                                />

                                <Button title="Save" onPress={handleSave} />

                            </View>
                        </View>
                    </ScrollView>
                </View>

            </TouchableWithoutFeedback>
        </Modal>

    );
};

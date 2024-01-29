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


const EditModal = ({ isVisible, onClose, onSave, item }) => {
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


export default function DataDisplay({ navigation, route }) {

    let t = {
        "date": "2024-01-01",
        "items": [
            {
                "case_size": null,
                "category": null,
                "description": "Fage",
                "id_": 1,
                "num_oz": null,
                "price": 1.49,
                "quantity": 7,
                "total_price": 10.43
            },
            {
                "case_size": null,
                "category": null,
                "description": "Quest",
                "id_": 2,
                "num_oz": null,
                "price": 9.49,
                "quantity": 1,
                "total_price": 7.48
            },
            {
                "case_size": null,
                "category": null,
                "description": "Gg eggs",
                "id_": 3,
                "num_oz": null,
                "price": 2.59,
                "quantity": 3,
                "total_price": 7.77
            },
            {
                "case_size": null,
                "category": null,
                "description": "Legendaryfds",
                "id_": 4,
                "num_oz": null,
                "price": 9.99,
                "quantity": 1,
                "total_price": 7.82
            },
            {
                "case_size": null,
                "category": null,
                "description": "Halo top",
                "id_": 5,
                "num_oz": null,
                "price": 0,
                "quantity": 1,
                "total_price": 4.69
            },
            // ... (additional items continue in the same format)
        ],
        "merchant_name": null,
        "pa_tax_paid": false,
        "subtotal": 145.18,
        "total": 146.71,
        "total_tax": 1.53
    }


    const [errorMsg, setErrorMsg] = useState("")
    const [drinkError, setDrinkError] = useState(false)

    // const r = route.params?.receiptData;

    // let receipt = null;
    // if (r) {

    //     for (let item of r) {
    //         if (!item.message) {
    //             receipt = item
    //         }
    //     }
    // }
    // else {
    //     receipt = t
    // }
    // if ( r.length > 1){
    //     receipt = r[1];
    // }
    // else{
    //     receipt = r[0];
    // }

    receipt = t

    const [items, setItems] = useState(receipt.items); // Assuming this will be populated from your data source
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);

    const { isTabBarVisible } = useGlobalContext();
    const { setIsTabBarVisible } = useGlobalContext();



    const IP = route.params.IP;

    const submitData = async () => {

        for (let itm of items) {
            if (itm.category === "tax-drink") {
                if (!itm.quantity) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs a quantity`)
                    return;
                }
                if (!itm.num_oz) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs an ounce amount`)
                    return;
                }
                if (!itm.case_size) {
                    setDrinkError(true)
                    setErrorMsg(`${itm.description} needs a case size`)
                    return;
                }
            }
        }

        let body = {
            ...receipt, // spread the receipt
            items: items,
        }



        // console.log("body", body);


        fetch(`http://${IP}:5001/add_to_db`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        }).then((response) => {
            // console.log(response)
            return response.json();
        })
            // needed because above then returns
            .then((result) => {
                console.log(result);
            })
            .catch(() => {
                console.log("Error posting receipt");
            });


        setIsTabBarVisible(true);
        navigation.navigate("HomePage", { renderMessage: true})


    };

    const openEditModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeEditModal = () => {
        setModalVisible(false);
        setSelectedItem(null);
    };


    const saveEdit = (updatedItem) => {
        const updatedItems = items.map(item =>
            item.id_ === updatedItem.id_ ? updatedItem : item
        );
        setItems(updatedItems); // updates the whole item array 
        closeEditModal();
    };

    const formatDate = (date) => {

        if (date) {
            const dateObj = new Date(date + 'T00:00:00');
            return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);

        }
        else {
            return "Need to fix lol "
        }

        // add try catch
    }


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            margin: 10,

        },
        headerText: {
            alignSelf: 'center',
            fontSize: 60,
            zIndex: 1, // Add this line
            fontWeight: '500',
        },
        rowStyle: {
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 20,
            padding: 20,
            borderBottomWidth: 3,
            borderBottomColor: 'white',

        },
        item: {
            margin: 10,
            fontSize: 20
        },
        itemHeader: {
            fontSize: 30,
            marginTop: 40,
            margin: 10,

        },
        centeredView: {
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 22
        },

        bottomRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 50,
        },
        bottomPrefix: {
            fontWeight: '700',
            fontSize: 25
        },
        bottomData: {
            fontSize: 25,
        },
        buttonStyle: {
            margin: 20,
            borderRadius: 10,
            borderWidth: 2,
            borderColor: '#77c3ec',
            backgroundColor: 'pink',



        },
        buttonText: {
            color: 'black',
            fontSize: 18,
            fontWeight: 'bold',
            alignSelf: 'center',
            margin: 15
        },

    })
    const deleteRow = (item) => {
        const updatedItems = items.filter((currItem) => currItem.id_ !== item.id_);
        setItems(updatedItems);
    }

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openEditModal(item)}>

            <SwipeRow
                right={[

                    {
                        title: 'Delete',
                        backgroundColor: 'tomato',
                        icon: { name: 'delete' },
                        onPress: () => deleteRow(item),
                    },
                ]}
                onSwipe={(swipeData) => {
                    console.log("swipeData", swipeData);

                }}
                style={{ marginVertical: 1 }}            >
               


                    <View style={styles.rowStyle}>
                        <Text style={styles.item}>{String(item.quantity)}</Text>
                        <Text style={styles.item}>{item.description}</Text>
                    </View>
               
            </SwipeRow>
        </TouchableOpacity>

           
        
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>Store</Text>
            </View>

            <View style={styles.rowStyle}>
                <Text style={styles.itemHeader}>Qty</Text>
                <Text style={styles.itemHeader}>Description</Text>
            </View>
            <GestureHandlerRootView style={{ flex: 1 }}>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => index.toString()}
                style={{
                    backgroundColor: 'lightgray',
                    borderRadius: 6,


                }}
            />
            </GestureHandlerRootView>

            {isModalVisible && (
                <EditModal
                    isVisible={isModalVisible}
                    onClose={closeEditModal}
                    onSave={saveEdit}
                    item={selectedItem}
                />
            )}
            <View style={{
                paddingTop: 80,
                marginBottom: 30,
                alignSelf: 'center'
            }}>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Date: </Text>
                    {/* <Text style={styles.bottomData}>{formatDate(r[0].date)}</Text> */}
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Subtotal: </Text>
                    <Text style={styles.bottomData}>${receipt.subtotal}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total Tax: </Text>
                    <Text style={styles.bottomData}>${receipt.total_tax}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total: </Text>
                    <Text style={styles.bottomData}>${receipt.total}</Text>
                </View>

                {drinkError && <Text>{errorMsg}</Text>}

                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={submitData}
                >
                    <Text style={styles.buttonText}>Next</Text>
                </TouchableOpacity>





            </View>
        </SafeAreaView>
    );
}
import React, { useState, useEffect} from 'react';

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

const EditModal = ({ isVisible, onClose, onSave, item }) => {
    // Local states for each field in the modal
    const [description, setDescription] = useState(item?.description);
    const [quantity, setQuantity] = useState(item?.quantity.toString()); // Convert quantity to string for TextInput
    const [itemSize, setItemSize] = useState(item?.item_size);
    const [caseSize, setCaseSize] = useState(item?.case_size);


    // Function to handle saving the edited item
    const handleSave = () => {
        // Create an updated item object
        const updatedItem = {
            ...item,
            description,
            quantity: parseInt(quantity, 10), // Convert quantity back to a number
            item_size: itemSize,
            case_size: caseSize,
        };

        // Call the onSave function passed from the parent component
        onSave(updatedItem);
    };

    // Reset local states when the modal is closed
    useEffect(() => {
        if (!isVisible) {
            setDescription(item?.description);
            setQuantity(item?.quantity.toString());
            setItemSize(item?.item_size);
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
            marginTop:130,
            backgroundColor: "white",
            borderRadius: 20,
            padding: 35,
            alignItems: "center",
            justifyContent:'center',
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
                        




                        <Text>Item Size:</Text>
                        <TextInput
                            style={styles.modalInput}
                            onChangeText={setItemSize}
                            value={itemSize}
                            placeholder="Item Size"
                        />

                        <Text>Case Size:</Text>
                        <TextInput
                            style={styles.modalInput}
                            onChangeText={setCaseSize}
                            value={caseSize}
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

    const r = route.params?.receiptData;

    // console.log(receiptData);

    // const r = [
    //     {
    //         "date": "2024-01-01",
    //         "items": [
    //             {
    //                 "case_size": "N/A",
    //                 "description": "FAGE",
    //                 "id_": 1,
    //                 "item_size": "N/A",
    //                 "price": 1.49,
    //                 "quantity": 7,
    //                 "total_price": 10.43
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "Quest",
    //                 "id_": 2,
    //                 "item_size": "N/A",
    //                 "price": 9.49,
    //                 "quantity": 1,
    //                 "total_price": 7.48
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG EGGS",
    //                 "id_": 3,
    //                 "item_size": "N/A",
    //                 "price": 2.59,
    //                 "quantity": 3,
    //                 "total_price": 7.77
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "LegendaryFds",
    //                 "id_": 4,
    //                 "item_size": "N/A",
    //                 "price": 9.99,
    //                 "quantity": 1,
    //                 "total_price": 7.82
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "HALO TOP",
    //                 "id_": 5,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 4.69
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "VEGETABLE",
    //                 "id_": 6,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 3.19
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "SARGENTO",
    //                 "id_": 7,
    //                 "item_size": "N/A",
    //                 "price": 3.49,
    //                 "quantity": 2,
    //                 "total_price": 6.98
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "PRETZEL",
    //                 "id_": 8,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 5.59
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "MORNINGSTAR",
    //                 "id_": 9,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 4.89
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "KETTLE",
    //                 "id_": 10,
    //                 "item_size": "N/A",
    //                 "price": 4.39,
    //                 "quantity": 1,
    //                 "total_price": 3.99
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "LESSEREVIL",
    //                 "id_": 11,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 5.49
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG CHIPS",
    //                 "id_": 12,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 3.99
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "NATURE'S",
    //                 "id_": 13,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 10.49
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "NASOYA VEGET",
    //                 "id_": 14,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 4.49
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG EGGS",
    //                 "id_": 15,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 4.99
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG CHEESE",
    //                 "id_": 16,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 5.79
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG VEGETABLE",
    //                 "id_": 17,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 1.99
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG TOMATO",
    //                 "id_": 18,
    //                 "item_size": "N/A",
    //                 "price": 2.59,
    //                 "quantity": 2,
    //                 "total_price": 5.18
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "GG VEGETABLE",
    //                 "id_": 19,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 2.19
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "BERRIES",
    //                 "id_": 20,
    //                 "item_size": "N/A",
    //                 "price": 5.99,
    //                 "quantity": 1,
    //                 "total_price": 4.79
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "DripDrop",
    //                 "id_": 21,
    //                 "item_size": "N/A",
    //                 "price": 12.99,
    //                 "quantity": 1,
    //                 "total_price": 10.17
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "HeroCsmetics",
    //                 "id_": 22,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 8.99
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "NUUN HYDRATE",
    //                 "id_": 23,
    //                 "item_size": "N/A",
    //                 "price": 6.99,
    //                 "quantity": 1,
    //                 "total_price": 5.51
    //             },
    //             {
    //                 "case_size": "N/A",
    //                 "description": "UP&UP 2CT S",
    //                 "id_": 24,
    //                 "item_size": "N/A",
    //                 "price": 0,
    //                 "quantity": 1,
    //                 "total_price": 8.29
    //             }
    //         ],
    //         "merchant_name": "mss Goy bia",
    //         "pa_tax_paid": false,
    //         "subtotal": 145.18,
    //         "total": 146.71,
    //         "total_tax": 1.53
    //     }
    // ]
    // const r = 
    const [items, setItems] = useState(r[0].items); // Assuming this will be populated from your data source
    const [isModalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);



    // const IP = '10.0.0.155'; // home 
    // const IP = '10.0.0.153'; // aba 

    // const IP = '192.168.5.122' // kennet 
    // const IP = '10.5.40.176' // cathy
    const IP = '10.215.231.46' // panera 

    const submitData = async () => {

        let body = {
            ...r[0], // spread the receipt
            items: items,
        }


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


        navigation.navigate("HomePage")


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
        const dateObj = new Date(date + 'T00:00:00');
        return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(dateObj);
    }
    

    const styles = StyleSheet.create({
        container: {
            flex:1, 
            margin:10,

        },
        headerText:{
            alignSelf:'center',
            fontSize:60,
            zIndex: 1, // Add this line
            fontWeight:'500',
        },
        rowStyle:{
            display:'flex',
            flexDirection:'row',
            justifyContent:'space-between',
            gap:10,
            padding: 20,
            borderBottomWidth: 0.5,
            borderBottomColor: '#cccccc',
            
        },
        item:{
            margin:10,
            fontSize:20
        },
        itemHeader:{
            fontSize:30,
            marginTop:40,
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
            justifyContent:'space-between',
            gap: 50,
        },
        bottomPrefix:{
            fontWeight:'700',
            fontSize:25
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

    const renderItem = ({ item }) => (
        <TouchableOpacity onPress={() => openEditModal(item)}>
            <View style={styles.rowStyle}>
                <Text style={styles.item}>{String(item.quantity)}</Text>
                <Text style={styles.item}>{item.description}</Text>
            </View>
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
            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item) => item.id_.toString()}
                style={{backgroundColor:'lightgray', 
                borderRadius:6,

            
            }}
            />
            {isModalVisible && (
                <EditModal
                    isVisible={isModalVisible}
                    onClose={closeEditModal}
                    onSave={saveEdit}
                    item={selectedItem}
                />
            )}
            <View style={{
                paddingTop:80,
                marginBottom:30,
                alignSelf:'center'
            }}>
                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Date: </Text>
                    <Text style={styles.bottomData}>{ formatDate(r[0].date)}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Subtotal: </Text>
                    <Text style={styles.bottomData}>${r[0].subtotal}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total Tax: </Text>
                    <Text style={styles.bottomData}>${r[0].total_tax}</Text>
                </View>

                <View style={styles.bottomRow}>
                    <Text style={styles.bottomPrefix}>Total: </Text>
                    <Text style={styles.bottomData}>${r[0].total}</Text>
                </View>

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

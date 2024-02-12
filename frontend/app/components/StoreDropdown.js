
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    FlatList,
    StyleSheet,
    TouchableWithoutFeedback,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    input: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000',
        borderBottomWidth: 0,
        backgroundColor: 'transparent',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        margin: 10,
        gap: 30,
    },
    dropdown: {
        backgroundColor: '#FFFFFF80',
        justifyContent: 'center',
        alignItems: 'center',
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    modalView: {
        width: '100%',
        height: '100%',
        marginTop:-30,
        justifyContent: "space-around",
        alignItems: 'center',

    },


    modalContent: {
        width: 200,
        backgroundColor: 'whitesmoke',
        borderRadius: 20,
        padding: 35,
        shadowRadius: 2,
        elevation: 1,
        borderColor: 'lightgray',
        borderWidth: 1
    },
    listItem: {
        padding: 15,
        //
        // borderBottomColor:'blue',
        borderBottomWidth: 1,
        // backgroundColor:'lightgray',
       

    },
});

const Dropdown = ({ toggleModal, data, handleSelect }) => {

    console.log("yoo", data);
    return (
        <Modal
            transparent={true}
            visible={true}
            onRequestClose={toggleModal}
        >
            <TouchableWithoutFeedback onPress={toggleModal}>
                <View style={styles.modalView}>
                    <View style={styles.modalContent}>
                        <FlatList
                            data={data}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => (

                                <TouchableOpacity
                                    style={styles.listItem}
                                    onPress={() => handleSelect(item)}
                                >
                                    <Text style={{fontSize:15}}>{item.name}</Text>
                                </TouchableOpacity>
                            )}


                        />
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </Modal>
    );
};

export default function StoreDropdown({ selectedStoreName, onStoreSelect, storeList }) {
    const [text, setText] = useState(selectedStoreName);
    const [dropDownVisible, setDropdownVisible] = useState(false);
    const [selected, setSelected] = useState("");

    // const data = [
    //     { key: '1', value: 'Mobiles' },
    //     { key: '2', value: 'Appliances' },
    //     { key: '3', value: 'Cameras' },
    //     { key: '4', value: 'Computers', },
    //     { key: '5', value: 'Vegetables' },
    //     { key: '6', value: 'Diary Products' },
    //     { key: '7', value: 'Drinks' },
    // ]

    console.log("from sdrop", storeList);
    const data = storeList?.stores;


    const handleSelect = (item) => {
        setText(item.name);
        onStoreSelect(item.name);
        toggleModal();
    };

    const toggleModal = () => {
        setDropdownVisible(!dropDownVisible);
    };
    

    const handleTextChange = (newText) => {
        setText(newText);
        onStoreSelect(newText);
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={handleTextChange}
                value={text}
            />
            <TouchableOpacity style={styles.dropdown} onPress={toggleModal}>
                <Feather name={dropDownVisible ? "arrow-up" : "arrow-down"} size={30} />
            </TouchableOpacity>
            {dropDownVisible && (
                <Dropdown
                    toggleModal={toggleModal}
                    data={data}
                    handleSelect={handleSelect}
                />
            )}
        </View>
    );
}

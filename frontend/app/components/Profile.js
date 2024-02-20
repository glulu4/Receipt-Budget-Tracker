import { Text, View, TouchableOpacity, StyleSheet, FlatList, TouchableHighlight } from 'react-native'
import React from 'react'
import { useGlobalContext } from './TabBarVisibilityContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';


const Profile = ({route, navigation}) => {
    const IP = route.params?.IP;


    console.log(IP);
    const { isUserSignedIn, setIsUserSignedIn, setCurrentUser, currentUser } = useGlobalContext()


    const styles = StyleSheet.create({

        screen: {
            flex:1,
            margin:10,
            alignItems: 'center',

        },
        header :{
            fontSize:25,
            textAlign:'center',
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
            // alignSelf: 'center',
            margin: 15,
            marginLeft:20,
            textAlign:'left'
        },
        icon:{
            marginTop:50
        }

    })

    const onLogout = () => {

        fetch(`http://${IP}:5001/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: {},
        }).then((response) => {
            // console.log(response)
            return response.json();
        })
        // needed because above then returns
            .then((data) => {
                console.log(data);
        })
        .catch((e) => {
            console.log("Error logging out");
            console.log(e);
        });



        setCurrentUser({});
        setIsUserSignedIn(false)
        
        

    }


    return (
        <View style={styles.screen}>




           <View style={styles.icon}>
                <AntDesign name='user' size={50} color='black' ></AntDesign>
           </View>

            <View style={{margin:20}}>
                <Text style={{ fontSize: 30}}>{currentUser.firstName + " " + currentUser.lastName}</Text>
                <Text style={{ fontSize: 17}}>{currentUser.email}</Text>

            </View>

            <View style={{ flexDirection:'row', marginTop:20 }}>
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'lightgray', borderRadius: 5, flexDirection: 'row', justifyContent:'space-between', alignItems:'center',  }} onPress={onLogout}>
                    <Text style={styles.buttonText}>Logout</Text>
                    <AntDesign name="right" size={20} style={{marginRight:10}}/>
                </TouchableOpacity>

               
            </View>





        </View>
    )

}
export default Profile;

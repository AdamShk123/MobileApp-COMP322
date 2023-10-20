import { View, StyleSheet, FlatList, Pressable, Text } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useContext, useEffect, useState } from "react";
import { UserType } from "../types/User";


type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>
// const Tab = createMaterialTopTabNavigator();

// const FriendsList = () => {
//     return (
//         <View style={[appStyles.primaryBackground, myStyles.componentView]}>

//         </View>
//     );
// }

// const AddFriends = () => {
//     return (
//         <View style={[appStyles.primaryBackground, myStyles.componentView]}>

//         </View>
//     );
// }

type ItemProps = {
    user: UserType;
};

const Item = ({user} : ItemProps) => {
    return (
        <Pressable>
            <Text style={[appStyles.h6, appStyles.primaryText]}>{user.email}</Text>
        </Pressable>
    );
};

const Friends = ({navigation, route}: Props) => {
    const [list, setList] = useState<UserType[]>([]);

    const databaseService = useContext(ServiceContext);

    useEffect(() => {
        databaseService.getFriends(route.params.id!).then((data) => {setList(data)});
    }, [route.params.id]);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Friends'}/>
            <FlatList style={myStyles.componentView} data={list} renderItem={({item}) => <Item user={item}/>}/>
            {/* <Tab.Navigator> */}
            {/*     <Tab.Screen name="FriendsList" component={FriendsList}/> */}
            {/*     <Tab.Screen name="AddFriends" component={AddFriends}/> */}
            {<Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => {navigation.navigate('AddFriend')}}>
                <Text style={[appStyles.primaryText, appStyles.h6]}>Add</Text>
            </Pressable>/* </Tab.Navigator> */}
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    },
    button: {
        minWidth: '60%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10%',
    },
    input: {
        minWidth: '100%',
        marginBottom: 10,
        borderBottomColor: '#999999',
        borderBottomWidth: 1,
    },
    title: {
        marginTop: 20,
    }
});

export default Friends;

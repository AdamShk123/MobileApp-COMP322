import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useEffect, useState, useContext } from "react";
import { UserType } from "../types/User";
import { FlatList } from "react-native-gesture-handler";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ItemProps = {
    user: UserType;
}

const Item = ({user} : ItemProps) => {
    return (
        <View>
            <Text style={[appStyles.h6, appStyles.primaryText]}>{user.email}</Text>
        </View>
    );
}

const AddFriend = ({navigation}: Props) => {
    const [value, setValue] = useState('');
    const [list, setList] = useState<UserType[]>([]);

    const facadeService = useContext(ServiceContext);
    
    useEffect(() => {
        console.log(value);
        if(value.length == 1){
            facadeService.searchUsers(value).then((data) => {
                setList(data);
            });
        } 
    }, [value]);

    const func = () : UserType[] => {
        if(value.length > 1){
            const nameRegex : RegExp = new RegExp('.*' + value + '.*');
            const newList : UserType[] = [];
            list.forEach((item) => {
                if(nameRegex.test(item.email)){
                    newList.push(item);
                }
            });
            return newList;
        }
        return list;
    };

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Add Friends'}/>
            <View style={[myStyles.formView]}>
                <TextInput  value={value} onChangeText={(text) => setValue(text)} placeholderTextColor={appStyles.secondaryText.color} placeholder="enter nickname..." style={[appStyles.primaryBackground, myStyles.input, appStyles.primaryText]}/>
                <FlatList style={myStyles.listView} data={func()} renderItem={({item}) => <Item user={item}/>}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Add</Text>
                </Pressable>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    }, 
    listView: {
        flex: 1,
    },
    formView: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: '60%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
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


export default AddFriend;

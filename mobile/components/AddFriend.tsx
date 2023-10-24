import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useEffect, useState, useContext } from "react";
import { UserType } from "../types/User";
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ItemProps = {
    user: UserType;
}

const Item = ({user} : ItemProps) => {
    const [toggle, setToggle] = useState(false);
    return (
        <View style={myStyles.listItem}>
            <Text style={[appStyles.h6, appStyles.primaryText]}>{user.email}</Text>
            <CheckBox tintColors={{true: appStyles.primaryText.color, false: appStyles.secondaryText.color}} value={toggle} onValueChange={(value) => {
                setToggle(value);
            }}/>
        </View>
    );
}

const AddFriend = ({navigation}: Props) => {
    const [value, setValue] = useState('');
    const [list, setList] = useState<UserType[]>([]);

    const facadeService = useContext(ServiceContext);
    
    useEffect(() => {
        if(value.length == 1){
            facadeService.searchUsers(value).then((data) => {
                setList(data);
            });
        } 
    }, [value]);

    const filterList = () : UserType[] => {
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
                <FlatList style={myStyles.listView} data={filterList()} renderItem={({item}) => <Item user={item}/>}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => navigation.navigate('Friends', {id: facadeService.getCurrentUser().id})}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Send Friend Invite</Text>
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
    listItem: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    formView: {
        flex: 1,
        flexDirection: 'column',
        maxWidth: '70%',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        minWidth: '100%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 10,
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

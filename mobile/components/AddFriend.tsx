import { View, StyleSheet, TextInput, Pressable, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useEffect, useState, useContext } from "react";
import { UserType } from "../types/User";
import { FlatList } from 'react-native-gesture-handler';
import CheckBox from '@react-native-community/checkbox';
import FooterBar from './FooterBar';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ItemProps = {
    user: UserType;
    list: UserType[];
    setList: any;
}

const equals = (o1: UserType, o2: UserType) : boolean => {
        if(o1.id != o2.id){
            return false;
        }
        return true;
};

const Item = ({user, list, setList} : ItemProps) => {
    const [toggle, setToggle] = useState(false);

    return (
        <View style={myStyles.listItem}>
            <Text style={[appStyles.h6, appStyles.primaryText]}>{user.email}</Text>
            <CheckBox tintColors={{true: appStyles.primaryText.color, false: appStyles.secondaryText.color}} value={toggle} onValueChange={(value) => {
                setToggle(value);
                const l = list.filter((item) => {
                    if(!equals(item, user)){
                        return item;
                    }
                });
                if(value){
                    l.push(user);
                }
                console.log(l);
                setList(l);
            }}/>
        </View>
    );
}

const AddFriend = ({navigation}: Props) => {
    const [value, setValue] = useState('');
    const [list, setList] = useState<UserType[]>([]);
    const [chosen, setChosen] = useState<UserType[]>([]);

    const facadeService = useContext(ServiceContext);  
    const screen = useContext(ScreenContext);

    useEffect(() => {
        const filtered = filterList();
        const l = chosen.filter((item) => {
            let check : boolean = false;
            filtered.forEach((i) => {
                if(equals(i, item)){
                    check = true;
                }
            });
            if(check){
                return item;
            }
        });
        setChosen(l);

        if(value.length == 1){
            facadeService.searchUsers(value).then((data) => {
                setList(data);
            });
        }
     }, [value]);

    const filterList = () : UserType[] => {
        if(value.length > 1){
            const nameRegex : RegExp = new RegExp('.*' + value + '.*');
            const l = list.filter((item) => {
                if(nameRegex.test(item.email)){
                    return item;
                }
            });
            return l;
        }
        return list;
    };

    const sendInvite = () => {
        facadeService.sendFriendInvites(chosen);
    };

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Add Friends'}/>
            <View style={[myStyles.formView]}>
                <TextInput  value={value} onChangeText={(text) => setValue(text)} placeholderTextColor={appStyles.secondaryText.color} placeholder="enter nickname..." style={[appStyles.primaryBackground, myStyles.input, appStyles.primaryText]}/>
                <FlatList style={myStyles.listView} data={filterList()} renderItem={({item}) => <Item user={item} list={chosen} setList={setChosen}/>}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={sendInvite}>
                    <Text style={[chosen.length > 0 ? appStyles.primaryText : appStyles.secondaryText, appStyles.h6]}>Send Friend Invite</Text>
                </Pressable>
            </View>
            <FooterBar current={screen}/>
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

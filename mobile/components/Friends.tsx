import { View, StyleSheet, FlatList, Pressable, Text } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";
import { UserType } from "../types/User";


type Props = NativeStackScreenProps<RootStackParamList, 'Friends'>

type ItemProps = {
    user: UserType;
    online: any;
};

const Item = ({user, online} : ItemProps) => {
    return (
        <Pressable style={[appStyles.secondaryBackground, myStyles.item]}>
            <Text style={[appStyles.h6, appStyles.primaryText]}>{user.email}</Text>
            <Text style={[appStyles.h6, {color: online ? 'green' : 'red', marginLeft: 10}]}>{online ? 'Online' : 'Offline'}</Text>
        </Pressable>
    );
};

const Friends = ({navigation, route}: Props) => {
    const [list, setList] = useState<ItemProps[]>([]);
    const facadeService = useContext(ServiceContext);

    const func = (result: any) => {
        const l = list.map((item) => {
            if(item.user.id in result){
                return {user: item.user, online: true} as ItemProps;
            }
            return item;
        })
        setList(l);
    };

    useEffect(() => {
        facadeService.getFriends(route.params.id!).then((data) => {
            const l = data.map((item) => {
                return {user: item, online: false} as ItemProps;
            })
            setList(l);
        });
    }, [route.params.id]);

    useEffect(() => {
        facadeService.subscribeOnline(facadeService.getCurrentUser().id, func);
    }, []);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Friends'}/>
            <FlatList style={myStyles.componentView} data={list} renderItem={({item}) => <Item user={item.user} online={item.online}/>}/>
            <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => {navigation.navigate('AddFriend')}}>
                <Text style={[appStyles.primaryText, appStyles.h6]}>Add Friend</Text>
            </Pressable>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    },
    item: {
        height: 50,
        margin: 20,
        marginBottom: 0,
        padding: 10,
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
    },
    button: {
        minWidth: '60%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
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

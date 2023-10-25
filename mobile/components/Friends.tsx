import { View, StyleSheet, FlatList, Pressable, Text, Dimensions } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";
import { UserType } from "../types/User";
import Icon from 'react-native-vector-icons/Ionicons';
import FooterBar from './FooterBar';

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
    const screen = useContext(ScreenContext);

    const func = (result: any) => {
        facadeService.getFriends(route.params.id!).then((data) => {
            const l = data.map((item: UserType) => {
                if(item.id in result){
                    return {user: item, online: true} as ItemProps;
                }
                return {user: item, online: false} as ItemProps;
            })
            setList(l);
        });
    };

    useEffect(() => {
        func([]);    
        facadeService.subscribeOnline(facadeService.getCurrentUser().id, func);
    }, [route.params.id]);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Friends'}/>
            <FlatList style={myStyles.componentView} data={list} renderItem={({item}) => <Item user={item.user} online={item.online}/>}/>
            <View style={myStyles.buttonOverlay}>
                <Pressable style={[myStyles.addButton]} onPress={() => navigation.navigate('AddFriend')}>
                    <Icon name='add-circle' style={[myStyles.buttonSize, appStyles.primaryText]}/>
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
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center'
    }, 
    title: {
        marginTop: 20,
    },
    buttonOverlay: {
        position: 'absolute',
        top: Dimensions.get("window").height - 100,
        left: Dimensions.get("window").width - 75,
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonSize: {
        fontSize: 50,
    }
});

export default Friends;

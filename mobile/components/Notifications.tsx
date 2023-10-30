import { View, Pressable, FlatList, StyleSheet, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";
import FooterBar from './FooterBar';
import { InviteType } from "../types/Invite";
import FacadeService from "../services/FacadeService";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ItemProps = {
    notification: InviteType,
    facadeService: FacadeService,
}

const Item = ({notification, facadeService} : ItemProps) => {

    const decline = () => {
        facadeService.deleteNotification(notification.id).then(() => console.log('deleted!'));
    };

    const accept = () => {
        facadeService.deleteNotification(notification.id).then(() => console.log('accepted!'));
        facadeService.addFriend(notification.pid).then(() => console.log('new friend!'));
    };

    return (
        <View style={[myStyles.itemView, appStyles.secondaryBackground]}>
            <Text style={[appStyles.primaryText, appStyles.h6]}>Friend Invite: {notification.pobject!.email}</Text>
            <View style={myStyles.buttonsView}>
                <Pressable style={[appStyles.primaryBackground, myStyles.itemButton]} onPress={accept}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Accept</Text>
                </Pressable>
                <Pressable style={[appStyles.primaryBackground, myStyles.itemButton]} onPress={decline}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Decline</Text>
                </Pressable>
            </View>
        </View>
    ); 
};

const Notifications = ({navigation}: Props) => {
    const [list, setList] = useState<InviteType[]>([]);

    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const func = () => {
        facadeService.getInvites().then((data) => setList(data)); 
    };

    useEffect(() => {
        facadeService.subscribeNotifications(facadeService.getCurrentUser().id, func);
    }, []);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Notifications'}/>
            <FlatList style={myStyles.componentView} data={list} renderItem={({item}) => <Item notification={item} facadeService={facadeService}/>}/>
            <FooterBar current={screen}/>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    },
    buttonsView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemView: {
        flex: 1,
        margin: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemButton: {
        flex: 1,
        margin: 5,
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

export default Notifications;

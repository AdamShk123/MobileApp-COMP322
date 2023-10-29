import { View, Pressable, FlatList, StyleSheet, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";
import FooterBar from './FooterBar';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type ItemProps = {
    notification: string
}

const Item = ({notification} : ItemProps) => {
    return (
        <View>{notification}</View>
    ); 
};

const Notifications = ({navigation}: Props) => {
    const [list, setList] = useState<string[]>([]);

    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const func = () => {
        setList([]);
    };

    useEffect(() => {
        // facadeService.subscribeNotifications(facadeService.getCurrentUser().id, func);
        facadeService.getInvites();
    }, []);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Notifications'}/>
            <FlatList style={myStyles.componentView} data={list} renderItem={({item}) => <Item notification={item}/>}/>
            <FooterBar current={screen}/>
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

export default Notifications;

import React, { useContext, useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { UserType } from '../types/User';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LogIn = ({navigation}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed() : void {
        const data = facadeService.logIn(email,password);
        data.then((data: UserType) => {
            const promise = facadeService.getUser(data.id);
            promise.then((data) => navigation.navigate('CampaignsList', {id: data.id}));
        });
    }

    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Log In'}/>
            <View style={myStyles.formView}>
                <TextInput style={myStyles.input} placeholder='enter email...' onChangeText={(value) => setEmail(value)}/>
                <TextInput style={myStyles.input} placeholder='enter password...' onChangeText={(value) => setPassword(value)}/>
                <Button title='Log In' onPress={() => buttonPressed()}/>
            </View>
        </View>
    );
};



const myStyles = StyleSheet.create({
    componentView: {
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
        backgroundColor: 'grey',
        //minWidth: '100%',
    },
    input: {
        color: 'grey',
        minWidth: '100%',
        backgroundColor: 'white',
    }
})



export default LogIn;

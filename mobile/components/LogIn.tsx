import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Text } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import { UserType } from '../types/User';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LogIn = ({navigation}: Props) => {
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed() : void {
        facadeService.logIn(form.email,form.password).then((data: UserType) => {
            setForm({email: '', password: ''});
            setError('');
            navigation.navigate('CampaignsList', {id: data.id});
        }).catch(() => setError('Password or email are incorrect!'));
    }

    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <View style={myStyles.formView}>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput value={form.email} style={myStyles.input} placeholder='enter email...' onChangeText={(value) => setForm({email: value, password: form.password})}/>
                <TextInput value={form.password} style={myStyles.input} placeholder='enter password...' onChangeText={(value) => setForm({email: form.email, password: value})}/>
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
    warningText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
    },
    button: {
        backgroundColor: 'grey',
    },
    input: {
        color: 'grey',
        minWidth: '100%',
        backgroundColor: 'white',
    }
})

export default LogIn;

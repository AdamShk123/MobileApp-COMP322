import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Pressable, TextInput, Text } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import { UserType } from '../types/User';
import HeaderBar from './HeaderBar';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LogIn = ({navigation}: Props) => {
    const [form, setForm] = useState({email: '', password: ''});
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function onButtonPressed() : void {
        facadeService.logIn(form.email,form.password).then((data: UserType) => {
            setForm({email: '', password: ''});
            setError('');
            facadeService.subscribeOnline(data.id, (result: any) => {}); 
            navigation.navigate('CampaignsList', {id: data.id});
        }).catch(() => setError('Password or email are incorrect!'));
    }

    return (
        <View style={[appStyles.primaryBackground,myStyles.componentView]}>
            {/* <Text style={[appStyles.h1, appStyles.primaryText, myStyles.title]}>Log In</Text> */}
            <HeaderBar navigation={navigation} headerText={'Log In'}/>
            <View style={myStyles.formView}>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={form.email} style={[myStyles.input, appStyles.primaryText, appStyles.h6]} placeholder='enter email...' onChangeText={(value) => setForm({email: value, password: form.password})}/>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={form.password} style={[myStyles.input, appStyles.primaryText, appStyles.h6]} placeholder='enter password...' onChangeText={(value) => setForm({email: form.email, password: value})}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => onButtonPressed()}>
                    <Text style={[appStyles.h4, appStyles.primaryText]}>Log In</Text>
                </Pressable>
            </View> 
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        alignItems: 'center',
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
    requirementsText: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
        marginBottom: 30,
    },
    warningText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 20,
    },
    button: {
        minWidth: '100%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
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


export default LogIn;

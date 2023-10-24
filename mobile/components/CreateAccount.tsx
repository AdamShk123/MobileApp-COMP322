import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, ScrollView, TextInput, Text, Alert, Pressable } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const emailRegex : RegExp = new RegExp('.*.@..*');
const passwordRegex: RegExp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');

const CreateAccount = ({navigation}: Props) => {
    const [form, setForm] = useState({email: '', password: '', confirm: ''});
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function onButtonPressed() : void {
        if(!disabled){
            facadeService.createUser(form.email, form.password).then((data) => console.log(data));
            setForm({email: '', password: '', confirm: ''});
            setDisabled(true);
            setError('');
            Alert.alert('Accout Created', 'Check email and click on confirmation link to finish.');
            navigation.navigate('StartMenu');
        }
    }

    useEffect(() => { 
        if(!passwordRegex.test(form.password)) {
            setDisabled(true);
            setError('Password doesn\'t meet requirements');
        }
        else if(form.password != form.confirm){
            setDisabled(true);
            setError('The passwords don\'t match!');
        }
        else if(!emailRegex.test(form.email)){
            setDisabled(true);
            setError('Provide a proper email address!');
        }
        else {
            setDisabled(false);
            setError('');
        }
    }, [form]);

    return (
        <View style={[appStyles.primaryBackground,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Create Account'}/>
            <ScrollView contentContainerStyle={myStyles.formView}>
                <Text style={myStyles.requirementsText}>Password has to be at least 8 characters long, have one uppercase, one lowercase, one number, and one special character</Text>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={form.email} style={[myStyles.input, appStyles.h6, appStyles.primaryText]} placeholder='enter email...' onChangeText={(value) => setForm({email: value, password: form.password, confirm: form.confirm})}/>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={form.password} style={[myStyles.input, appStyles.h6, appStyles.primaryText]} placeholder='enter password...' onChangeText={(value) => setForm({email: form.email, password: value, confirm: form.confirm})}/>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={form.confirm} style={[myStyles.input, appStyles.h6, appStyles.primaryText]} placeholder='confirm password' onChangeText={(value) => setForm({email: form.email, password: form.password, confirm: value})}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => onButtonPressed()}>
                    <Text style={[appStyles.h4, {color: disabled ? appStyles.secondaryText.color : appStyles.primaryText.color}]}>Create Account</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        alignItems: 'center'
    },
    formView: {
        flex: 1,
        flexDirection: 'column',
        marginLeft: 'auto',
        marginRight: 'auto',
        alignItems: 'center',
        justifyContent: 'center',
    },
    requirementsText: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
        marginBottom: 20,
        maxWidth: '60%'
    },
    warningText: {
        color: 'red',
        fontWeight: 'bold',
        fontSize: 16,
        maxWidth: '60%',
        marginBottom: 20
    },
    button: {
        minWidth: '60%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        marginBottom: '10%',
    },
    input: {
        minWidth: '60%',
        marginBottom: 10,
        borderBottomColor: '#999999',
        borderBottomWidth: 1,
    },
    title: {
        marginTop: 20,
    }
})

export default CreateAccount;

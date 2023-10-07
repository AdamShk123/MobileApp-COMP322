import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, View, Button, TextInput, Text, Alert } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';

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
        facadeService.createUser(form.email, form.password).then((data) => console.log(data));
        setForm({email: '', password: '', confirm: ''});
        setDisabled(true);
        setError('');
        Alert.alert('Accout Created', 'Check email and click on confirmation link to finish.');
        navigation.navigate('StartMenu');
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
        <View style={[appStyles.background,myStyles.componentView]}>
            <View style={myStyles.formView}>
                <Text style={myStyles.requirementsText}>Password has to be at least 8 characters long, have one uppercase, one lowercase, one number, and one special character</Text>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput value={form.email} style={myStyles.input} placeholder='enter email...' onChangeText={(value) => setForm({email: value, password: form.password, confirm: form.confirm})}/>
                <TextInput value={form.password} style={myStyles.input} placeholder='enter password...' onChangeText={(value) => setForm({email: form.email, password: value, confirm: form.confirm})}/>
                <TextInput value={form.confirm} style={myStyles.input} placeholder='confirm password' onChangeText={(value) => setForm({email: form.email, password: form.password, confirm: value})}/>
                <Button disabled={disabled} title='Create Account' onPress={() => onButtonPressed()}/>
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
    requirementsText: {
        color: 'white',
        fontWeight: 'normal',
        fontSize: 16,
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

export default CreateAccount;

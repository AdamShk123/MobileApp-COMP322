import React, { useContext, useState } from 'react';
import { StyleSheet, View, Button, TextInput } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CreateAccount = ({navigation}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirm, setConfirm] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed() : void {
        if(password == confirm){
            facadeService.createUser(email, password).then((data) => console.log(data));
            navigation.navigate('StartMenu');
        }
    }

    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Create Account'}/>
            <View style={myStyles.formView}>
                <TextInput style={myStyles.input} placeholder='enter email...' onChangeText={(value) => setEmail(value)}/>
                <TextInput style={myStyles.input} placeholder='enter password...' onChangeText={(value) => setPassword(value)}/>
                <TextInput style={myStyles.input} placeholder='confirm password' onChangeText={(value) => setConfirm(value)}/>
                <Button title='Create Account' onPress={() => buttonPressed()}/>
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
    },
    input: {
        color: 'grey',
        minWidth: '100%',
        backgroundColor: 'white',
    }
})



export default CreateAccount;

import React from 'react';
import {TextInput, Button, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CreateAccount = ({navigation}: Props) => {
    return (
        <View>
            <TextInput placeholder='Nickname'/>
            <TextInput placeholder='Email'/>
            <TextInput placeholder='Password'/>
            <TextInput placeholder='Re-type Password'/>
            <Button title='Create Account' onPress={() => navigation.navigate('Home')}/>
        </View>
    );
};

export default CreateAccount;

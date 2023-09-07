import React from 'react'
import {Text, Button, View} from 'react-native'

import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const StartMenu = ({navigation}: Props) => {
    return (
        <View>
            <Button title='Log In'/>
            <Button title='Create Account' onPress={() => navigation.navigate('CreateAccount')}/>
        </View>
    );
};

export default StartMenu;

import React from 'react';
import {TextInput, Button, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LogIn = ({navigation}: Props) => {
    return (
        <View>
        </View>
    );
};

export default LogIn;

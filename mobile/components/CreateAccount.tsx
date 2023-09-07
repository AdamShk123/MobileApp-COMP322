import React from 'react'
import {Button, View} from 'react-native'

import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CreateAccount = ({navigation}: Props) => {
    return (
        <View>
            <Button title='Create Account' onPress={() => navigation.navigate('Home')}/>
        </View>
    );
};

export default CreateAccount;

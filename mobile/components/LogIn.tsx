import React, { useContext, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import { Button, Input } from '@rneui/themed';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const LogIn = ({navigation}: Props) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed() : void {
        //facadeService
        navigation.navigate('CampaignsList');
    }

    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Log In'}/>
            <View style={myStyles.formView}>
                <Input inputStyle={myStyles.input} label={'Email'} placeholder={'Enter Your Email...'} onChangeText={(value) => setEmail(value)}/>
                <Input style={myStyles.input} label={'Password'} placeholder={'Enter Your Password...'} onChangeText={(value) => setPassword(value)}/>
                <Button buttonStyle={myStyles.button} title='Log In' onPress={() => buttonPressed()}/>
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
        maxWidth: '100%',
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
    }
})



export default LogIn;

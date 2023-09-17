import React from 'react'
import {View, Text, Pressable, StyleSheet} from 'react-native'
import appStyles from '../styles'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const StartMenu = ({navigation}: Props) => {
    return (
        <View style={[myStyles.componentView, appStyles.background]}>
            <Text style={[appStyles.header, myStyles.header]}>App Title</Text>
            <View style={myStyles.buttonView}>
                <Pressable style={[appStyles.button, myStyles.button]} onPress={() => navigation.navigate('CampaignsList')}>
                    <Text style={appStyles.text}>Log In</Text>
                </Pressable>
                <Pressable style={[appStyles.button, myStyles.button]} onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={appStyles.text}>Create Account</Text>
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
    buttonView: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginBottom: 10,
        alignItems: 'center',
        minWidth: '50%',
    },
    header: {
        marginTop: 10,
    }
})

export default StartMenu;

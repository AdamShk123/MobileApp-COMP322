import React from 'react'
import {View, Text, Pressable, StyleSheet, Image} from 'react-native'
import appStyles from '../styles'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const StartMenu = ({navigation}: Props) => {
    return (
        <View style={[myStyles.componentView, appStyles.primaryBackground]}>
            <View style={myStyles.topView}>
                <Image source={require('../resources/app-icon-2.png')}/>
                <Text style={[appStyles.primaryText, myStyles.header]}>Minimap</Text>
            </View>
            <View style={myStyles.lowerView}>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => navigation.navigate('LogIn')}>
                    <Text style={[appStyles.primaryText,appStyles.h4]}>Log In</Text>
                </Pressable>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={[appStyles.primaryText, appStyles.h4]}>Create Account</Text>
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
    topView: {
        marginTop: 20,
    },
    lowerView: {
        marginBottom: 20,
        flex:1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 50,
        minWidth: '50%',
    },
    header: {
        fontSize: 60,
    }
})

export default StartMenu;

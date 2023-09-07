import React from 'react'
import {StyleSheet, Pressable, View, Text} from 'react-native'
import colors from '../styles'
import {NativeStackNavigationProp} from '@react-navigation/native-stack'
import { RootStackParamList } from '../App';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const StartMenu = ({navigation}: Props) => {
    return (
        <View style={{flex:1, alignSelf:'center'}}>
            <Text style={styles.title}>D&D Universe</Text>
            <View style={styles.view}>
                <Pressable style={[styles.button,colors.backgroundBlack]}>
                    <Text style={[colors.textWhite, styles.text]}>Log In</Text>
                </Pressable>
                <Pressable style={[styles.button,colors.backgroundBlack]} onPress={() => navigation.navigate('CreateAccount')}>
                    <Text style={[colors.textWhite, styles.text]}>Create Account</Text>
                </Pressable>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 3,
        marginBottom: 5,
    },
    view: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
    },
    text: {
        padding: 3,
        fontSize: 15,
    },
    title: {
        color: 'red',
        fontSize: 24,
        fontWeight: 'bold',
        textShadowRadius: 5,
    }
});


export default StartMenu;

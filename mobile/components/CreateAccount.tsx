import React from 'react';
import { StyleSheet, View} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const CreateAccount = ({navigation}: Props) => {
    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Create Account'}/>            
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    },
    containerView: {
        minHeight: 50,
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'grey',
    },
    header: {
        color: 'black',
    },
    button: {
        marginBottom: 10,
        alignItems: 'center',
        minWidth: '50%',
    }
})



export default CreateAccount;

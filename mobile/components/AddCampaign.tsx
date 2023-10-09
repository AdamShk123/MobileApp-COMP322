import { View, Button, TextInput, StyleSheet, Text, Pressable } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const campaignNameRegex: RegExp = new RegExp('[0-9a-zA-Z-:!\' ]*.{1,}$');

const AddCampaign = ({navigation}: Props) => {
    const [name, setName] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function onButtonPressed(){
        const id = facadeService.getCurrentUser().id;
        const promise = facadeService.createCampaign({cname: name, cdmid: id}); 
        promise.then(() => {
            setName('');
            setDisabled(true);
            setError('');
            navigation.navigate('CampaignsList', {id: id});
        });
    }

    useEffect(() => {
        if(!campaignNameRegex.test(name)){
            setDisabled(true);
            setError('Name isn\'t at least one character long or contains special characters that are not allowed');
        }
        else{
            setDisabled(false);
            setError('');
        }
    }, [name])

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Add Campaign'}/>
            <View style={myStyles.formView}>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput placeholderTextColor={appStyles.secondaryText.color} value={name} style={[myStyles.input, appStyles.primaryText, appStyles.h6]} placeholder='enter campaign name...' onChangeText={(value) => setName(value)}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => onButtonPressed()}>
                    <Text style={[appStyles.h4, appStyles.primaryText]}>Log In</Text>
                </Pressable>
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
    warningText: {
        color: 'red',
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        minWidth: '60%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: '10%',
    },
    input: {
        minWidth: '100%',
        marginBottom: 10,
        borderBottomColor: '#999999',
        borderBottomWidth: 1,
    }
})


export default AddCampaign;

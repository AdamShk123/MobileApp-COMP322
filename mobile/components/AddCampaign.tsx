import { View, Button, TextInput, StyleSheet, Text } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, campaignNameRegex } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const AddCampaign = ({navigation}: Props) => {
    const [name, setName] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed(){
        const id = facadeService.getCurrentUser().id;
        const promise = facadeService.createCampaign({cname: name, cdmid: id}); 
        promise.then(() => navigation.navigate('CampaignsList', {id: id}));
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
        <View style={[appStyles.background, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Add Campaign'}/>
            <View style={myStyles.formView}>
                <Text style={myStyles.warningText}>{error}</Text>
                <TextInput value={name} style={myStyles.input} placeholder='Enter campaign name...' onChangeText={(value) => setName(value)}/>
                <Button disabled={disabled} title='Create Campaign' onPress={() => buttonPressed()}/>
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
        backgroundColor: 'grey',
        //minWidth: '100%',
    },
    input: {
        color: 'grey',
        minWidth: '100%',
        backgroundColor: 'white',
    }
})


export default AddCampaign;

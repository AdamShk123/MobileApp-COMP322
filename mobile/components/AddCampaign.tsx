import { View, Button, TextInput, StyleSheet, Text, Pressable, Image } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from "react";
import { launchImageLibrary } from "react-native-image-picker";

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

const campaignNameRegex: RegExp = new RegExp('[0-9a-zA-Z-:!\' ]*.{1,}$');

const AddCampaign = ({navigation}: Props) => {
    const [name, setName] = useState('');
    const [selectedImage, setSelectedImage] = useState('');
    const [disabled, setDisabled] = useState(true);
    const [error, setError] = useState('');

    const facadeService = useContext(ServiceContext);

    function onButtonPressed(){
        const id = facadeService.getCurrentUser().id;
        const promise = facadeService.createCampaign({cname: name, cdmid: id}); 
        promise.then((result) => {
            setName('');
            setDisabled(true);
            setError('');
            facadeService.Supabase(result.id, selectedImage);
            navigation.navigate('CampaignsList', {id: id});
        });
    }

    function imagePressed(){
        launchImageLibrary({mediaType: 'photo', includeBase64: true}, (result) => {
            if(!result.didCancel){
                setSelectedImage(result.assets![0].base64!);
            }
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
                {/* <Image style={{width: 100, height: 100}} source={{uri: selectedImage}}/> */}
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => imagePressed()}>
                    <Text style={[appStyles.h4, appStyles.primaryText]}>Select Image</Text>
                </Pressable>
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

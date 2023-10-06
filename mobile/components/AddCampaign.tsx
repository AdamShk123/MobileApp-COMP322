import { View, Button, TextInput, StyleSheet } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useState } from "react";
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}



const AddCampaign = ({navigation}: Props) => {
    const [name, setName] = useState('');

    const facadeService = useContext(ServiceContext);

    function buttonPressed(){
        const id = facadeService.getCurrentUser().id;
        const promise = facadeService.createCampaign({cname: name, cdmid: id}); 
        promise.then(() => navigation.navigate('CampaignsList', {id: id}));
    }

    return (
        <View style={[appStyles.background, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Add Campaign'}/>
            <View style={myStyles.formView}>
                <TextInput style={myStyles.input} placeholder='Enter campaign name...' onChangeText={(value) => setName(value)}/>
                <Button title='Create Campaign' onPress={() => buttonPressed()}/>
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

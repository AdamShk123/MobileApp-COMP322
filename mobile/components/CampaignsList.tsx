import React, { useContext, useEffect, useState } from 'react'
import {StyleSheet, Pressable, Text, View, FlatList, Image} from 'react-native'
import appStyles from '../styles';         
import { NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import HeaderBar from './HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { CampaignType } from '../types/Campaign';

type Props = NativeStackScreenProps<RootStackParamList, 'CampaignsList'>

type Campaign = {
    campaignName: string;
    dmName: string;
    campaignID: string;
}

const Item = ({campaignName, dmName = 'Adam', campaignID}: Campaign) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return(
        <Pressable style={[appStyles.button, myStyles.button]} onPress={() => navigation.navigate('Campaign', {id: campaignID})}>
            <View style={myStyles.pictureView}>
                <Image style={myStyles.picture} source={require('../resources/smiley.jpg')}/>
            </View>
            <View style={myStyles.textButton}>
                <Text style={[appStyles.text, myStyles.text]}>{campaignName}</Text>
                <Text style={[appStyles.text, myStyles.text]}>{dmName}</Text>
            </View>
            <View style={myStyles.pictureView}>
                <Image style={myStyles.picture} source={require('../resources/kebab.png')}/>
            </View>
        </Pressable>
    );
};

const CampaignsList = ({navigation, route}: Props) => {
    const [list, setList] = useState<CampaignType[]>([]);
    const facadeService = useContext(ServiceContext);

    useEffect(() => {
        facadeService.getCampaigns(route.params.id).then((data) => setList(data));
    }, [route.params])
    
    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Campaigns List'}/>
            <View style={myStyles.listView}>
                <FlatList data={list} renderItem={({item}) => <Item campaignName={item.name} dmName={'Adam'} campaignID={item.id}/>}/>
            </View>
            <Pressable style={[appStyles.button, myStyles.addButton]} onPress={() => navigation.navigate('AddCampaign')}>
                <Text style={appStyles.text}>Add Campaign</Text>
            </Pressable>
        </View>
   );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column',
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
    listView: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        color: 'black',
    },
    button: {
        maxHeight: 50,
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        padding: 2,
    },
    textButton: {
        flex: 3,
        flexDirection: 'column'
    },
    picture: {
        maxHeight: 40,
        maxWidth: 40,
    },
    pictureView: {
        margin: 2,
        alignContent: 'center',
        justifyContent: 'center',
    },
    text: {
        marginRight: 15,
    },
    addButton: {
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});



export default CampaignsList;


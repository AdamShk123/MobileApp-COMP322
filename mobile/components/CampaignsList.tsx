import React, { useContext, useEffect, useState } from 'react'
import {StyleSheet, Pressable, Text, View, FlatList, ScrollView, ImageBackground} from 'react-native'
import appStyles from '../styles';         
import { NativeStackScreenProps, NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import HeaderBar from './HeaderBar';
import { useNavigation } from '@react-navigation/native';
import { CampaignType } from '../types/Campaign';
import Icon from 'react-native-vector-icons/Ionicons';

type Props = NativeStackScreenProps<RootStackParamList, 'CampaignsList'>

type Campaign = {
    campaignName: string;
    dmName: string;
    campaignID: string;
}

const Item = ({campaignName, dmName = 'Adam', campaignID}: Campaign) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return(
        <Pressable style={[myStyles.itemView]}>
            <ImageBackground style={myStyles.image} source={{uri: 'https://flbygwtoslnwzjpqkbpp.supabase.co/storage/v1/object/public/campaigns/' + campaignID + '/main.png'}}>
                <View style={myStyles.overlay}/>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={() => navigation.navigate('Campaign', {id: campaignID})}>
                    <Text style={[appStyles.primaryText, appStyles.h3]}>{campaignName}</Text>
                </Pressable>
            </ImageBackground>
        </Pressable>
    );
};

const CampaignsList = ({navigation, route}: Props) => {
    const [list, setList] = useState<CampaignType[]>([]);
    const facadeService = useContext(ServiceContext);

    useEffect(() => {
        if(route.params.id){
            facadeService.getCampaigns(route.params.id).then((data) => setList(data));
        }
    }, [route.params])
    
    return (
        <View style={[appStyles.primaryBackground,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Campaigns List'}/>
            <FlatList style={myStyles.listView} data={list} renderItem={({item}) => <Item campaignName={item.name} dmName={'Adam'} campaignID={item.id}/>}/>
            <View style={myStyles.buttonOverlay}>
                <Pressable style={[myStyles.addButton]} onPress={() => navigation.navigate('AddCampaign')}>
                    <Icon name='add-circle' style={[appStyles.h1, appStyles.primaryText]}/>
                </Pressable>
            </View>
        </View>
   );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column',
    },
    listView: {
        flex: 1,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    buttonOverlay: {
        position: 'absolute',
        top: 75,
        left: 20,
    },
    image: {
        width: 1000,
        height: 1000,
        alignItems: 'center',
        justifyContent: 'center',
    },
    itemView: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        borderBottomWidth: 5,
        borderBottomColor: '#000050',
    },
    button: {
        minWidth: '100%',
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,90,0.4)',
    },
    addButton: {
        alignItems: 'center',
        justifyContent: 'center',
    }
});



export default CampaignsList;


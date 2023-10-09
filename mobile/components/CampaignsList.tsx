import React, { useContext, useEffect, useState } from 'react'
import {StyleSheet, Pressable, Text, View, FlatList, ScrollView, ImageBackground} from 'react-native'
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
    imageURL: string;
}

const Item = ({campaignName, dmName = 'Adam', campaignID, imageURL}: Campaign) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    return(
        <Pressable style={[myStyles.itemView]}>
            <ImageBackground style={myStyles.image} source={{uri: imageURL}}>
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
        facadeService.getCampaigns(route.params.id).then((data) => setList(data));
    }, [route.params])
    
    return (
        <View style={[appStyles.primaryBackground,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Campaigns List'}/>
            {/* <ScrollView ref={scroll} nestedScrollEnabled={true} horizontal={true}> */}
            <FlatList style={myStyles.listView} data={list} renderItem={({item}) => <Item imageURL={facadeService.getURL('campaigns',item.id)} campaignName={item.name} dmName={'Adam'} campaignID={item.id}/>}/>
            {/* </ScrollView> */}
            <Pressable style={[myStyles.addButton, appStyles.secondaryBackground]} onPress={() => navigation.navigate('AddCampaign')}>
                <Text style={[appStyles.h6, appStyles.primaryText]}>Add Campaign</Text>
            </Pressable>
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
        minHeight: 50,
        alignItems: 'center',
        justifyContent: 'center',
    }
});



export default CampaignsList;


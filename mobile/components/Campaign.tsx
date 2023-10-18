import { StyleSheet, View, Button, Text, Image } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from 'react';
import { CampaignType } from "../types/Campaign";
import { API_URL } from '@env'
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;



const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);

    useEffect(() => {
        if(route.params.id){
            setID(route.params.id);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
                facadeService.updateCampaignPlayedData(data.id);
            });
        }
    }, [route.params]);

    if(!route.params.id && !id){
        return (
            <View style={[myStyles.componentView, appStyles.primaryBackground]}>
                <HeaderBar navigation={navigation} headerText={'Campaign'}/>
                <Text style={[appStyles.primaryText, appStyles.h6]}>You have to choose one of the campaigns on the campaigns list screen first!</Text>
            </View>
        );
    }

    return (
        <View style={myStyles.componentView}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <View style={myStyles.mapView}>
                <Button title='map'/>
                <Image style={{width: '100%', height: '100%'}} source={{uri: API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'}}/>
            </View>
            <View style={myStyles.tabsView}>
                <Button title='tabs'/>
                <Image style={{width: '50%', height: '50%'}} source={{uri: 'https://static.vecteezy.com/system/resources/previews/014/376/091/original/dice-illustration-in-3d-isometric-style-png.png'}>
                function getRandomInt(min, max) {
                  min = Math.ceil(min);
                  max = Math.floor(max);
                  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
                }
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column'
    },
    mapView: {
        flex: 1,
    },
    tabsView: {
        flex: 1,
    }
})

export default Campaign;

import { StyleSheet, View, Button, Text, Image } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from 'react';
import { CampaignType } from "../types/Campaign";
import { API_URL } from '@env'
import FooterBar from './FooterBar';

type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;


const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
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
            </View>
            <FooterBar current={screen}/>
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

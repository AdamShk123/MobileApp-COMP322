import { StyleSheet, View, Button, Text } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState } from 'react';
import { CampaignType } from "../types/Campaign";

type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;



const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const facadeService = useContext(ServiceContext);

    useEffect(() => {
        facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
            setData(data);
            facadeService.updateCampaignPlayedData(data.id);
        });
    }, [route.params]);

    return (
        <View style={myStyles.componentView}>
            <HeaderBar navigation={navigation} headerText={'Campaign'}/>
            <View style={myStyles.mapView}>
                <Button title='map'/>
                <Text>Campaign Name: {data.name}</Text>
                <Text>Campaign ID: {data.id}</Text>
                <Text>Campaign Status(Ongoing): {data.ongoing}</Text>
                <Text>Campaign Created Date: {data.created.toString()}</Text>
            </View>
            <View style={myStyles.tabsView}>
                <Button title='tabs'/>
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

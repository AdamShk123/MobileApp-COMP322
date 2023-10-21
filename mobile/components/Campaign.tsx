import { StyleSheet, View, Button, Text, Image, Animated } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState, useRef, createRef } from 'react';
import { CampaignType } from "../types/Campaign";
import { API_URL } from '@env';
import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
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

    const scale = useRef(new Animated.Value(1)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;

    const MapPinchHandler = Animated.event([{nativeEvent: {scale}}], {useNativeDriver: true});
    const MapPanHandler = Animated.event([{nativeEvent: {translationX: translateX, translationY: translateY}}], {useNativeDriver: true});

    const pinchRef = createRef()
    const panRef = createRef()

    return (
        <View style={myStyles.componentView}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <Button title='map'/>
            <Animated.View style={myStyles.mapView}>
                <PinchGestureHandler onGestureEvent={MapPinchHandler} ref={pinchRef} simultaneousHandlers={[panRef]}>
                    <Animated.View>
                        <PanGestureHandler onGestureEvent={MapPanHandler} ref={panRef} simultaneousHandlers={[pinchRef]}>
                            <Animated.Image style={{width: '100%', height: '100%', transform: [{scale}, {translateX}, {translateY}]}} source={{uri: API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'}}/>
                        </PanGestureHandler>
                    </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
            <View style={myStyles.tabsView}>
                <Button title='tabs'/>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#606060',
    },
    mapView: {
        flex: 1,
        backgroundColor: '#606060',
    },
    tabsView: {
        flex: 1,
        backgroundColor: '#606060',
    }
})

export default Campaign;

import { StyleSheet, View, Button, Text, Image, Animated } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState, useRef, createRef, createContext } from 'react';
import { CampaignType } from "../types/Campaign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL } from '@env';
import { PanGestureHandler, PinchGestureHandler, State } from 'react-native-gesture-handler';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;
import FooterBar from './FooterBar';
import { NavigationContainer } from "@react-navigation/native";
import DiceTab from "./DiceTab";
import ChatTab from "./ChatTab";

export type TabParamList = {
    Dice: undefined,
    Chat: {message: string},
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export const BroadcastContext = createContext<string>('');

const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [broadcast, setBroadcast] = useState<string>('');
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    let prevValues = {x: 0, y: 0, scale: 1};
    
    const callback = (presences: any) => {
        console.log(presences);
    };

    useEffect(() => {
        if(route.params.id){
            setID(route.params.id);
            facadeService.subscribeCampaignOnline(route.params.id, facadeService.getCurrentUser().id, callback);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
                facadeService.updateCampaignPlayedData(data.id);
            });
        }
        translateX.setOffset(prevValues.x);
        translateX.setValue(0);
        translateY.setOffset(prevValues.y);
        translateY.setValue(0);
        baseScale.setValue(1);
    }, [route.params]);

    if(!route.params.id && !id){
        return (
            <View style={[myStyles.componentView, appStyles.primaryBackground]}>
                <HeaderBar navigation={navigation} headerText={'Campaign'}/>
                <Text style={[appStyles.primaryText, appStyles.h6, {flex: 1}]}>You have to choose one of the campaigns on the campaigns list screen first!</Text>
                <FooterBar current={screen}/>
            </View>
        );
    }

    const MapPinchHandler = Animated.event([{
        nativeEvent: {
            scale: pinchScale
        }}],
        {
            useNativeDriver: true
        });

    const minZoom = 0.25;
    const maxZoom = 4;

    const pinchStateChanged = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            prevValues.scale *= nativeEvent.scale;
            baseScale.setValue(prevValues.scale);
            pinchScale.setValue(1);
            if (baseScale.__getValue() > maxZoom) {
                baseScale.setValue(maxZoom);
                prevValues.scale = maxZoom;
            } else if (baseScale.__getValue() < minZoom) {
                baseScale.setValue(minZoom);
                prevValues.scale = minZoom;
            }
        }
    };

    const panStateChanged = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            prevValues.x += nativeEvent.translationX;
            prevValues.y += nativeEvent.translationY;
            translateX.setOffset(prevValues.x);
            translateX.setValue(0);
            translateY.setOffset(prevValues.y);
            translateY.setValue(0);
        }
    };

    const MapPanHandler = Animated.event([{
        nativeEvent: {
            translationX: translateX,
            translationY: translateY
        }}],
        {
            useNativeDriver: true
        });

    const pinchRef = createRef()
    const panRef = createRef()

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <Button title="press" onPress={() => {setBroadcast('hel')}}/>
            <Animated.View
                style={myStyles.mapView}
            >
                <PanGestureHandler
                    onGestureEvent={MapPanHandler}
                    onHandlerStateChange={panStateChanged}
                    ref={panRef}
                    simultaneousHandlers={[pinchRef]}
                    shouldCancelWhenOutside
                >
                    <Animated.View>
                        <PinchGestureHandler
                            onGestureEvent={MapPinchHandler}
                            onHandlerStateChange={pinchStateChanged}
                            ref={pinchRef}
                            simultaneousHandlers={[panRef]}
                        >
                            <Animated.Image
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    transform: [
                                        {translateX},
                                        {translateY},
                                        {scale}
                                    ]
                                }}
                                source={{
                                    uri: API_URL + '/storage/v1/object/public/campaigns/' + data.id + '/main.png'
                                }}
                            />
                        </PinchGestureHandler>
                    </Animated.View>
                </PanGestureHandler>
            </Animated.View>
            <View style={myStyles.tabsView}>
                <BroadcastContext.Provider value={broadcast}>
                    <NavigationContainer independent={true}>
                        <Tab.Navigator screenOptions={{tabBarLabelStyle: appStyles.primaryText,tabBarStyle: appStyles.secondaryBackground, tabBarIndicatorStyle: {backgroundColor: appStyles.primaryText.color}}}>
                            <Tab.Screen name='Dice' component={DiceTab}/>
                            <Tab.Screen name='Chat' component={ChatTab} initialParams={{message: broadcast}}/>
                        </Tab.Navigator>
                    </NavigationContainer>
                </BroadcastContext.Provider>
            </View>
            <FooterBar current={screen}/>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column',
    },
    mapView: {
        flex: 1,
        zIndex: -1,
    },
    tabsView: {
        flex: 1,
    }
})

export default Campaign;

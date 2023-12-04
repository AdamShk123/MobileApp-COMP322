import { StyleSheet, View, Button, Text, Image, Animated } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState, useRef, createRef, createContext } from 'react';
import { CampaignType } from "../types/Campaign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL } from '@env';
import { Gesture, GestureDetector, GestureEvent, GestureStateChangeEvent, PanGestureHandler, PinchGestureHandler, State, TapGestureHandler, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;
import FooterBar from './FooterBar';
import { NavigationContainer } from "@react-navigation/native";
import DiceTab from "./DiceTab";
import ChatTab from "./ChatTab";
import { useApp, useObject, useQuery, useRealm } from "@realm/react";
import { Character, Position, Stats, Status } from "../models/Character";
import { CampaignRealm, ChatRoom } from "../models/Campaign";
import { CanonicalObjectSchema, List, ObjectChangeCallback } from "realm";
import { Results, Object } from "realm/dist/bundle";
import CharacterSheetTab from "./CharacterSheetTab";

export type TabParamList = {
    Dice: undefined,
    Chat: undefined,
    Character: undefined,
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

export const CampaignContext = createContext<CampaignRealm | null>(null);

const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const baseScale = useRef(new Animated.Value(1)).current;
    const pinchScale = useRef(new Animated.Value(1)).current;
    const scale = useRef(Animated.multiply(baseScale, pinchScale)).current;
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    let prevValues = {x: 0, y: 0, scale: 1};

    const campaign = useQuery(CampaignRealm, campaigns => {
        return campaigns
    });
    const characters = useQuery(Character, characters => {
        const result = characters.filtered("user_id == $0", facadeService.getCurrentUser().id);
        return result;
    });
    const chat = useQuery(ChatRoom, chats => {
        return chats
    });

    useEffect(() => {
        if(route.params.id){
            setID(route.params.id);
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

        realm.subscriptions.update((subs) => {
            subs.add(campaign, {name:"campaign"});
            subs.add(characters, {name:"characters"});
            subs.add(chat, {name: 'chats'});
        });
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

    const realm = useRealm();
        
    const c = useObject(CampaignRealm, data.id.toString());

    function tapCallback(event: GestureStateChangeEvent<TapGestureHandlerEventPayload>, success: boolean) {
        realm.write(() => {
            characters.at(0)!.position = {x: Math.round(event.x), y: Math.round(event.y)} as Position;
        });
    }

    const tap = Gesture.Tap();
    tap.onEnd(tapCallback);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <GestureDetector gesture={tap}>
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
            </GestureDetector>
            <View style={myStyles.tabsView}>
                <CampaignContext.Provider value={c}>
                    <NavigationContainer independent={true}>
                        <Tab.Navigator screenOptions={{tabBarLabelStyle: appStyles.primaryText,tabBarStyle: [appStyles.secondaryBackground, {height: 50}], tabBarIndicatorStyle: {backgroundColor: appStyles.primaryText.color}}}>
                            <Tab.Screen name='Dice' component={DiceTab}/>
                            <Tab.Screen name='Chat' component={ChatTab}/>
                            <Tab.Screen name='Character' component={CharacterSheetTab}/>
                        </Tab.Navigator>
                    </NavigationContainer>
                </CampaignContext.Provider>
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

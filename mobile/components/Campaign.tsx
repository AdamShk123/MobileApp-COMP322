import { StyleSheet, View, Button, Text, Image, Animated, Dimensions } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState, useRef, createRef, createContext } from 'react';
import { CampaignType } from "../types/Campaign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL } from '@env';
import { Gesture, GestureDetector, GestureEvent, GestureStateChangeEvent, PanGestureHandler, State, TapGestureHandler, TapGestureHandlerEventPayload } from 'react-native-gesture-handler';
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
import CampaignMap from "./CampaignMap";

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
    const screenHeight = Dimensions.get('window').height;
    const translateY = useRef(new Animated.Value(0)).current;
    const sliderHeight = 25;
    const [heights, setHeights] = useState({map: ((screenHeight - 50 - 70 - 24 - sliderHeight) / 2), tabs: ((screenHeight - 50 - 70 - 24 - sliderHeight) / 2)}); // I'm manually figuring what the heights of the views should be to make the slider bar more accurate
    totalHeight = (screenHeight - 50 - 70 - 24 - sliderHeight);

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

    const realm = useRealm();

    useEffect(() => {
        realm.removeAllListeners();
        if(route.params.id){
            setID(route.params.id);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
                facadeService.updateCampaignPlayedData(data.id);
            });
        }
        translateY.setValue(0);

        realm?.subscriptions.update((subs) => {
            subs.add(campaign, {name:"campaign"});
            subs.add(characters, {name:"characters"});
            subs.add(chat, {name: 'chats'});
        });

        setHeights({map: ((screenHeight - 50 - 70 - 24 - sliderHeight) / 2), tabs: ((screenHeight - 50 - 70 - 24 - sliderHeight) / 2)});
    }, [route.params]);

    const c = useObject(CampaignRealm, data.id.toString());

    if(!route.params.id && !id){
        return (
            <View style={[myStyles.componentView, appStyles.primaryBackground]}>
                <HeaderBar navigation={navigation} headerText={'Campaign'}/>
                <Text style={[appStyles.primaryText, appStyles.h6, {flex: 1}]}>You have to choose one of the campaigns on the campaigns list screen first!</Text>
                <FooterBar current={screen}/>
            </View>
        );
    }

    const panStateChanged = ({nativeEvent}) => {
        if (nativeEvent.oldState === State.ACTIVE) {
            if (heights.map + nativeEvent.translationY < 0) {
                setHeights({map: 0, tabs: totalHeight})
            } else if (heights.tabs - nativeEvent.translationY < 0) {
                setHeights({map: totalHeight, tabs: 0})
            } else {
                setHeights({map: heights.map + nativeEvent.translationY, tabs: heights.tabs - nativeEvent.translationY});
            }
            translateY.setValue(0);
        }
    };
    const MapPanHandler = Animated.event([{
        nativeEvent: {
            translationY: translateY
        }}],
        {
            useNativeDriver: true
        });
    const panRef = createRef()

    function tapCallback(event: GestureStateChangeEvent<TapGestureHandlerEventPayload>, success: boolean) {
        realm.write(() => {
            const character = c?.characters.filtered("user_id == $0", facadeService.getCurrentUser().id).at(0);
            character!.position = {x: Math.round(event.x), y: Math.round(event.y)} as Position;
        });
    } // <GestureDetector gesture={tap}></GestureDetector> is how you would get this to work but it caused issues with the slider

    const tap = Gesture.Tap();
    tap.onEnd(tapCallback);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <Animated.View style={{height: heights.map, zIndex: -1}}>
                <CampaignMap route={route} characters={characters} initialSize={{width: Dimensions.get('window').width, height: heights.map}}/>
            </Animated.View>
            <Animated.View>
                <PanGestureHandler
                    onGestureEvent={MapPanHandler}
                    onHandlerStateChange={panStateChanged}
                    ref={panRef}
                >
                    <Animated.View
                        style={{
                            height: sliderHeight,
                            backgroundColor: 'blue',
                            width: '100%',
                            zIndex: 1
                        }}
                    />
                </PanGestureHandler>
            </Animated.View>
            <Animated.View style={{height: heights.tabs}}>
                <CampaignContext.Provider value={c}>
                    <NavigationContainer independent={true}>
                        <Tab.Navigator screenOptions={{tabBarLabelStyle: appStyles.primaryText,tabBarStyle: [appStyles.secondaryBackground, {height: 50}], tabBarIndicatorStyle: {backgroundColor: appStyles.primaryText.color}}}>
                            <Tab.Screen name='Dice' component={DiceTab}/>
                            <Tab.Screen name='Chat' component={ChatTab}/>
                            <Tab.Screen name='Character' component={CharacterSheetTab}/>
                        </Tab.Navigator>
                    </NavigationContainer>
                </CampaignContext.Provider>
            </Animated.View>
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
        zIndex: -1,
    },
    tabsView: {
    }
})

export default Campaign;

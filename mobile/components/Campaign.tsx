import { StyleSheet, View, Button, Text, Image, Animated, Dimensions } from "react-native";
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import { RootStackParamList, ServiceContext, ScreenContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import { useContext, useEffect, useState, createContext, useRef, createRef } from 'react';
import { CampaignType } from "../types/Campaign";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { API_URL } from '@env';
type Props = NativeStackScreenProps<RootStackParamList, 'Campaign'>;
import FooterBar from './FooterBar';
import { NavigationContainer } from "@react-navigation/native";
import DiceTab from "./DiceTab";
import ChatTab from "./ChatTab";
import CampaignMap from "./CampaignMap";
import { PanGestureHandler, State } from 'react-native-gesture-handler';

export type TabParamList = {
    Dice: undefined,
    Chat: undefined,
};

const Tab = createMaterialTopTabNavigator<TabParamList>();

const Campaign = ({navigation, route}: Props) => {
    const [data, setData] = useState<CampaignType>({name: 'defaultName', id: 'defaultID', ongoing: true, created: new Date()});
    const [id, setID] = useState('');
    const facadeService = useContext(ServiceContext);
    const screen = useContext(ScreenContext);
    const screenHeight = Dimensions.get('window').height;
    const sliderPos = useRef(new Animated.Value(0.5)).current;
    const [mapFlex, setMapFlex] = useState(0.5);
    const [tabsFlex, setTabsFlex] = useState(0.5);
    const mapRef = createRef();
    const tabsRef = createRef();
    let sliderHeight = 25;

    useEffect(() => {
        if(route.params.id){
            setID(route.params.id);
            facadeService.getCampaign(route.params.id).then((data: CampaignType) => {
                setData(data);
                facadeService.updateCampaignPlayedData(data.id);
            });
            setMapFlex((screenHeight - sliderHeight) / (2 * screenHeight))
            setTabsFlex((screenHeight - sliderHeight) / (2 * screenHeight))
        }
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

    const panStateChanged = ({nativeEvent}) => {
            if (nativeEvent.oldState === State.ACTIVE) {
                setMapFlex(mapFlex + (nativeEvent.translationY - sliderHeight) / screenHeight);
                setTabsFlex(tabsFlex - (nativeEvent.translationY - sliderHeight) / screenHeight);
                if (mapFlex.__value > 0.99 || tabsFlex.__value < 0.01) {
                    setMapFlex(0.99);
                    setTabsFlex(0.01);
                }
                sliderPos.setValue(0);
            }
        };

    const proportionPanHandler = Animated.event([{
            nativeEvent: {
                translationY: sliderPos
            }}],
            {
                useNativeDriver: true
            });

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={data.name}/>
            <View
                style={{
                    zIndex: -1,
                    flex: mapFlex,
                    overflow: 'visible'
                }}
                ref={mapRef}
            >
                <CampaignMap route={route}/>
            </View>
            <View>
                <PanGestureHandler
                    onGestureEvent={proportionPanHandler}
                    onHandlerStateChange={panStateChanged}
                >
                    <Animated.View
                        style={{
                            width: '100%',
                            height: sliderHeight,
                            backgroundColor: 'blue',
                        }}
                    />
                </PanGestureHandler>
            </View>
            <View
                style={{
                    flex: tabsFlex
                }}
                ref={tabsRef}
            >
                <NavigationContainer independent={true}>
                    <Tab.Navigator screenOptions={{tabBarLabelStyle: appStyles.primaryText,tabBarStyle: appStyles.secondaryBackground, tabBarIndicatorStyle: {backgroundColor: appStyles.primaryText.color}}}>
                        <Tab.Screen name='Dice' component={DiceTab}/>
                        <Tab.Screen name='Chat' component={ChatTab}/>
                    </Tab.Navigator>
                </NavigationContainer>
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
        flex: 0.5,
        zIndex: -1,
    },
    tabsView: {
        flex: 0.5,
    }
})

export default Campaign;

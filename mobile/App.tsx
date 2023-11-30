import 'react-native-gesture-handler';
import React, { createContext, useCallback, useState } from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, Button } from 'react-native';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createDrawerNavigator, DrawerContentComponentProps } from '@react-navigation/drawer';

import StartMenu from './components/StartMenu';
import CreateAccount from './components/CreateAccount';
import CampaignsList from './components/CampaignsList';
import LogIn from './components/LogIn';
import Friends from './components/Friends';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Profile from './components/Profile';
import AddCampaign from './components/AddCampaign';
import AddFriend from './components/AddFriend';
import Campaign from './components/Campaign';

import DatabaseService from './services/DatabaseService';
import UserService from './services/UserService';
import CampaignService from './services/CampaignService';
import FacadeService from './services/FacadeService';
import appStyles from './styles';

import Realm, {ObjectSchema} from 'realm';
import {createRealmContext,RealmProvider, AppProvider, UserProvider, useApp} from "@realm/react";
import {CampaignRealm, ChatRoom, Message} from './models/Campaign';
import {Character, Position, Stats, Status} from './models/Character';

const realmConfig: Realm.Configuration = {
    schema: [CampaignRealm, ChatRoom, Message, Character, Status, Stats, Position],
    schemaVersion: 0,
}

const databaseService = new DatabaseService();
const userService = new UserService(databaseService);
const campaignService = new CampaignService(databaseService);
const facadeService = new FacadeService(userService, campaignService, databaseService);

export const ServiceContext = createContext(facadeService);
export const ScreenContext = createContext<string>('');

export type RootStackParamList = {
    StartMenu: undefined,
    CreateAccount: undefined,
    CampaignsList: {id?: string},
    Campaign: {id?: string},
    LogIn: undefined,
    Friends: {id?: string},
    Settings: undefined,
    Notifications: undefined,
    Profile: undefined,
    AddCampaign: undefined,
    AddFriend: undefined,
}

const Stack = createDrawerNavigator<RootStackParamList>();

const Drawer = (props: DrawerContentComponentProps) => {
    const nav = useCallback((screen: string, args: any = {}) => {
        props.navigation.navigate(screen, args);
    }, [props]);

    return (
        <View style={[myStyles.drawerView, appStyles.secondaryBackground]}>
            <Pressable style={myStyles.drawerButton} onPress={() => nav('Profile')}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Profile</Text>
            </Pressable>
            <Pressable style={myStyles.drawerButton} onPress={() => nav('CampaignsList')}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Campaigns List</Text>
            </Pressable>
            <Pressable style={myStyles.drawerButton} onPress={() => nav('Friends', {id: facadeService.getCurrentUser().id})}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Friends</Text>
            </Pressable>
            <Pressable style={myStyles.drawerButton} onPress={() => nav('Notifications')}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Notifications</Text>
            </Pressable>
            <Pressable style={myStyles.drawerButton} onPress={() => nav('Settings')}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Settings</Text>
            </Pressable>
            <Pressable style={myStyles.drawerButton} onPress={() => {facadeService.logOut(); nav('StartMenu');}}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Sign Out</Text>
            </Pressable>
        </View>
    );
};

const App = () => {
    const [name, setName] = useState('');
    const navigationRef = useNavigationContainerRef();

    function changed() {
        const routeName = navigationRef.getCurrentRoute()?.name;
        if(routeName){
            setName(routeName);
        }
    }

    return (
        <SafeAreaView style={{flex: 1}}>
            <AppProvider id='devicesync-sbzfb'>
                <UserProvider fallback={realmLogIn}>
                    <RealmProvider schema={realmConfig.schema} sync={{flexible: true}}> 
                        <ServiceContext.Provider value={facadeService}>
                            <ScreenContext.Provider value={name}>
                                <NavigationContainer ref={navigationRef} onStateChange={() => changed()}>
                                    <Stack.Navigator drawerContent={(props) => Drawer(props)} initialRouteName='StartMenu' backBehavior='history'>
                                        <Stack.Screen name='StartMenu' component={StartMenu} options={{headerShown: false, swipeEnabled: false}}/>
                                        <Stack.Screen name='CreateAccount' component={CreateAccount} options={{headerShown: false, swipeEnabled: false}}/>
                                        <Stack.Screen name='LogIn' component={LogIn} options={{headerShown: false, swipeEnabled: false}}/>
                                        <Stack.Screen name='CampaignsList' component={CampaignsList} options={{headerShown: false}}/>
                                        <Stack.Screen name='Campaign' component={Campaign} options={{headerShown: false}}/>
                                        <Stack.Screen name='Friends' component={Friends} options={{headerShown: false}}/>
                                        <Stack.Screen name='Notifications' component={Notifications} options={{headerShown: false}}/>
                                        <Stack.Screen name='Settings' component={Settings} options={{headerShown: false}}/>
                                        <Stack.Screen name='Profile' component={Profile} options={{headerShown: false}}/>
                                        <Stack.Screen name='AddCampaign' component={AddCampaign} options={{headerShown: false}}/>
                                        <Stack.Screen name='AddFriend' component={AddFriend} options={{headerShown: false}}/>
                                    </Stack.Navigator>
                                </NavigationContainer>
                            </ScreenContext.Provider>
                        </ServiceContext.Provider>
                    </RealmProvider>
                </UserProvider>
            </AppProvider>
        </SafeAreaView>
    );
};

const realmLogIn = () => {
    const app = useApp();

    async function logIn() {
        await app.logIn(Realm.Credentials.anonymous());
    }

    return (
        <View>
            <Button title={"log in"} onPress={logIn}></Button>
        </View>
    )
}

const myStyles = StyleSheet.create({
    drawerView: {
        flex: 1, 
        flexDirection: 'column', 
        padding: 10,
        borderColor: appStyles.primaryText.color,
        borderRightWidth: 2,
    },
    drawerButton: {
        width: '100%',
        height: 50
    }
})

export default App;

import 'react-native-gesture-handler';
import React, { createContext } from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';

import StartMenu from './components/StartMenu';
import CreateAccount from './components/CreateAccount';
import CampaignsList from './components/CampaignsList';
import LogIn from './components/LogIn';
import Friends from './components/Friends';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Profile from './components/Profile';
import AddCampaign from './components/AddCampaign';
import Campaign from './components/Campaign';

import DatabaseService from './services/DatabaseService';
import UserService from './services/UserService';
import CampaignService from './services/CampaignService';
import FacadeService from './services/FacadeService';


const databaseService = new DatabaseService();
const userService = new UserService(databaseService);
const campaignService = new CampaignService(databaseService);
const facadeService = new FacadeService(userService, campaignService);

export const ServiceContext = createContext(facadeService);

export const emailRegex : RegExp = new RegExp('.*.@..*');
export const passwordRegex: RegExp = new RegExp('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$');
export const campaignNameRegex: RegExp = new RegExp('[0-9a-zA-Z-:!\' ]*.{1,}$');

export type RootStackParamList = {
    StartMenu: undefined,
    CreateAccount: undefined,
    CampaignsList: {id: string},
    Campaign: {id: string},
    LogIn: undefined,
    Friends: undefined,
    Settings: undefined,
    Notifications: undefined,
    Profile: undefined,
    AddCampaign: undefined,
}

const Stack = createDrawerNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
        <ServiceContext.Provider value={facadeService}>
            <NavigationContainer>
                <Stack.Navigator initialRouteName='StartMenu' backBehavior='history'>
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
                </Stack.Navigator>
            </NavigationContainer>
        </ServiceContext.Provider>
    </SafeAreaView>
  );
};

export default App;

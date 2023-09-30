import 'react-native-gesture-handler';
import React from 'react';
import { SafeAreaView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
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
import select from './services/DatabaseService';

export type RootStackParamList = {
    StartMenu: undefined,
    CreateAccount: undefined,
    CampaignsList: undefined,
    Campaign: undefined,
    LogIn: undefined,
    Friends: undefined,
    Settings: undefined,
    Notifications: undefined,
    Profile: undefined,
    AddCampaign: undefined,
}

//const Stack = createNativeStackNavigator<RootStackParamList>();

const Stack = createDrawerNavigator<RootStackParamList>();

select().then((data) => console.log(data)).catch((error) => console.log(error));

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
       <NavigationContainer>
            <Stack.Navigator initialRouteName='StartMenu' backBehavior='history'>
                <Stack.Screen name='StartMenu' component={StartMenu} options={{headerShown: false}}/>
                <Stack.Screen name='CreateAccount' component={CreateAccount} options={{headerShown: false}}/>
                <Stack.Screen name='LogIn' component={LogIn} options={{headerShown: true}}/>
                <Stack.Screen name='CampaignsList' component={CampaignsList} options={{headerShown: false}}/>
                <Stack.Screen name='Campaign' component={Campaign} options={{headerShown: false}}/>
                <Stack.Screen name='Friends' component={Friends} options={{headerShown: false}}/>
                <Stack.Screen name='Notifications' component={Notifications} options={{headerShown: false}}/>
                <Stack.Screen name='Settings' component={Settings} options={{headerShown: false}}/>
                <Stack.Screen name='Profile' component={Profile} options={{headerShown: false}}/>
                <Stack.Screen name='AddCampaign' component={AddCampaign} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

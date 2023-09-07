import React from 'react';
import {
   SafeAreaView,
   StyleSheet,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import StartMenu from './components/StartMenu';
import CreateAccount from './components/CreateAccount';
import Home from './components/Home';

export type RootStackParamList = {
    StartMenu: undefined,
    CreateAccount: undefined,
    Home: undefined,
}

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
       <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name="StartMenu" component={StartMenu} options={{headerShown: false}}/>
                <Stack.Screen name="CreateAccount" component={CreateAccount} options={{headerShown: false}}/>
                <Stack.Screen name="Home" component={Home} options={{headerShown: false}}/>
            </Stack.Navigator>
        </NavigationContainer>
    </SafeAreaView>
  );
};

export default App;

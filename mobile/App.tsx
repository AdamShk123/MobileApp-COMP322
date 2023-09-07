import React from 'react';
import {
   TextInput,
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

const styles = StyleSheet.create({
    appBackground: {
        backgroundColor: 'black'
    },
    title: {
        color: 'red',
        fontSize: 40,
        fontWeight: 'bold',
        fontFamily: 'Arial',
        textAlign: 'center',
        marginTop: 40,
        textShadowRadius: 5,
        textShadowColor: 'rgb(200,0,0)',
    },
});

export default App;

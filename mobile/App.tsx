/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

function App(): JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <ScrollView style={styles.appBackground}>
        <Text style={styles.title}>
            D&D Universe
        </Text>        
    </ScrollView>
  );
}

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

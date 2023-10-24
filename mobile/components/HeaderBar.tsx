import { View, Pressable, Text, StyleSheet } from "react-native";
import appStyles from "../styles";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { DrawerActions } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/Ionicons';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    headerText: string;
}

const HeaderBar = ({navigation, headerText}: Props) => {
    return (
        <View style={[myStyles.containerView, appStyles.secondaryBackground]}>
                <Pressable style={appStyles.secondaryBackground} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Icon name='menu' style={[appStyles.primaryText, appStyles.h2]}/>
                </Pressable>
                <Text style={[appStyles.h3, appStyles.primaryText]}>{headerText}</Text>
                <Pressable style={appStyles.secondaryBackground} onPress={() => navigation.navigate('Profile')}>
                    <Icon name='person-circle' style={[appStyles.primaryText, appStyles.h2]}/>
                </Pressable>
        </View>
    ); 
};

const myStyles = StyleSheet.create({
    containerView: {
        maxHeight: 50,
        minHeight: 50,
        width: '100%',
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#F5B40F',
        borderBottomWidth: 2,
        paddingLeft: 10,
        paddingRight: 10,
    },
});

export default HeaderBar;



import { View, Pressable, Text, StyleSheet } from "react-native";
import appStyles from "../styles";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { DrawerActions } from "@react-navigation/native";
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
    headerText: string;
}

const HeaderBar = ({navigation, headerText}: Props) => {
    return (
        <View style={myStyles.containerView}>
            <View style={myStyles.headerView}>
                <Pressable style={appStyles.button} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Text>Menu</Text>
                </Pressable>
                <Text style={[appStyles.header, myStyles.header]}>{headerText}</Text>
                <Pressable style={appStyles.button} onPress={() => navigation.navigate('Profile')}>
                    <Text>Profile</Text>
                </Pressable>
            </View>
        </View>
    ); 
};

const myStyles = StyleSheet.create({
    containerView: {
        minHeight: 50,
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'grey',
    },
    header: {
        color: 'black',
    },
});

export default HeaderBar;



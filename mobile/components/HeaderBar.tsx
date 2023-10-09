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
        <View style={[myStyles.containerView, appStyles.secondaryBackground]}>
                <Pressable style={appStyles.secondaryBackground} onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Menu</Text>
                </Pressable>
                <Text style={[appStyles.h3, appStyles.primaryText]}>{headerText}</Text>
                <Pressable style={appStyles.secondaryBackground} onPress={() => navigation.navigate('Profile')}>
                    <Text style={[appStyles.primaryText, appStyles.h6]}>Profile</Text>
                </Pressable>
        </View>
    ); 
};

const myStyles = StyleSheet.create({
    containerView: {
        maxHeight: 50,
        minHeight: 50,
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default HeaderBar;



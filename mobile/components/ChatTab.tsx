import { View, StyleSheet } from "react-native";
import appStyles from '../styles';
import { TabParamList } from './Campaign';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';

type Props = {
    navigation: MaterialTopTabNavigationProp<TabParamList>;
}



const ChatTab = ({navigation}: Props) => {

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    }
});

export default ChatTab;

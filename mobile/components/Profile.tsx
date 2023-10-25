import { View, StyleSheet } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList, ScreenContext, ServiceContext } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
import FooterBar from './FooterBar';
import { useContext } from "react";
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}



const Profile = ({navigation}: Props) => {
    const screen = useContext(ScreenContext);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Profile'}/>
            <View style={myStyles.componentView}></View>
            <FooterBar current={screen}/>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    }
});

export default Profile;

import { StyleSheet, View, Button } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}



const Campaign = ({navigation}: Props) => {
    return (
        <View style={myStyles.componentView}>
            <HeaderBar navigation={navigation} headerText={'Campaign'}/>
            <View style={myStyles.mapView}>
                <Button title='map'/>
            </View>
            <View style={myStyles.tabsView}>
                <Button title='tabs'/>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column'
    },
    mapView: {
        flex: 1,
    },
    tabsView: {
        flex: 1,
    }
})

export default Campaign;

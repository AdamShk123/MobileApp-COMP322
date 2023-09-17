import { View } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}



const Campaign = ({navigation}: Props) => {
    return (
        <View style={{flex: 1}}>
            <HeaderBar navigation={navigation} headerText={'Campaign'}/>
        </View>
    );
};

export default Campaign;

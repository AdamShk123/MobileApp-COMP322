import { View } from "react-native";
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import appStyles from '../styles';
import HeaderBar from './HeaderBar';
type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}



const AddCampaign = ({navigation}: Props) => {
    return (
        <View style={{flex: 1}}>
            <HeaderBar navigation={navigation} headerText={'Add Campaign'}/>
        </View>
    );
};

export default AddCampaign;

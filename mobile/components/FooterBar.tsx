import { View, Pressable, Text, StyleSheet } from "react-native";
import appStyles from "../styles";
import { RootStackParamList } from '../App';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useEffect, useRef, useState } from "react";
import * as i1 from 'react-native-vector-icons/MaterialCommunityIcons';
import * as i2 from 'react-native-vector-icons/MaterialIcons';

type Props = {
    current: string;
}

const FooterBar = ({current} : Props) => { 
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [screen, setScreen] = useState('CampaignsList');
    const [disabled, setDisabled] = useState(true);

    useEffect(() => {
        switch (current) {
            case 'CampaignsList': {
                setDisabled(false);
                setScreen('CampaignsList');
                break;
            }
            case 'Campaign': {
                setDisabled(false);
                setScreen('Campaign');
                break;
            }
            case 'Notifications': {
                setDisabled(false);
                setScreen('Notifications');
                break;
            }
            case 'Friends': {
                setDisabled(false);
                setScreen('Friends');
                break;
            }
            case 'LogIn': {
                setDisabled(true);
                break;
            }
            case 'CreateAccount': {
                setDisabled(true);
                break;
            }
            case 'StartMenu': {
                setDisabled(true);
                break;
            }
        }
    }, [current]);

    if(disabled){
        return (<View></View>);
    }
    
    return (
        <View style={[myStyles.insideView, appStyles.secondaryBackground]}>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('CampaignsList', {})}>
                <i1.default name="view-list" style={{color: screen == 'CampaignsList' ? appStyles.primaryText.color : appStyles.secondaryText.color}} size={appStyles.h2.fontSize}/>
                <Text style={[appStyles.h6, {color: screen == 'CampaignsList' ? appStyles.primaryText.color : appStyles.secondaryText.color}]}>List</Text>
            </Pressable>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('Campaign',{})}>
                <i1.default name="knife-military" style={{color: screen == 'Campaign' ? appStyles.primaryText.color : appStyles.secondaryText.color}} size={appStyles.h2.fontSize} color={appStyles.primaryText.color}/>
                <Text style={[appStyles.h6, {color: screen == 'Campaign' ? appStyles.primaryText.color : appStyles.secondaryText.color}]}>Campaign</Text>
            </Pressable>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('Notifications')}>
                <i2.default name="notifications" style={{color: screen == 'Notifications' ? appStyles.primaryText.color : appStyles.secondaryText.color}}size={appStyles.h2.fontSize} color={appStyles.secondaryText.color}/>
                <Text style={[appStyles.h6, {color: screen == 'Notifications' ? appStyles.primaryText.color : appStyles.secondaryText.color}]}>Notifications</Text>
            </Pressable>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('Friends')}>
                <i2.default name="person" style={{color: screen == 'Friends' ? appStyles.primaryText.color : appStyles.secondaryText.color}} size={appStyles.h2.fontSize} color={appStyles.secondaryText.color}/>
                <Text style={[appStyles.h6, {color: screen == 'Friends' ? appStyles.primaryText.color : appStyles.secondaryText.color}]}>Friends</Text>
            </Pressable>
        </View>
    ); 
};

const myStyles = StyleSheet.create({
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1,
    },
    insideView: {
        maxHeight: 70,
        minHeight: 70,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: '#F5B40F',
        borderTopWidth: 2,
    },
});

export default FooterBar;



import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import appStyles from "../styles";
import { RootStackParamList, ServiceContext } from '../App';
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useContext, useEffect, useRef, useState } from "react";
import * as i1 from 'react-native-vector-icons/MaterialCommunityIcons';
import * as i2 from 'react-native-vector-icons/MaterialIcons';

type Props = {
    current: string;
}

const FooterBar = ({current} : Props) => { 
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const facadeService = useContext(ServiceContext);
    const currentUser = facadeService.getCurrentUser();
    const [screen, setScreen] = useState('CampaignsList');

    const ref = useRef<Text>(null);

    useEffect(() => {
        console.log(current);
        switch (current) {
            case 'CampaignsList': {
                setScreen('CampaignsList');
                break;
            }
            case 'Campaign': {
                setScreen('Campaign');
                break;
            }
            case 'Notifications': {
                setScreen('Notifications');
                break;
            }
            case 'Friends': {
                setScreen('Friends');
                break;
            }
        }
    }, [current]);
    
    return (
        <View style={[myStyles.insideView, appStyles.secondaryBackground]}>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('CampaignsList', {id: currentUser.id})}>
                <i1.default name="view-list" style={{color: screen == 'CampaignsList' ? appStyles.primaryText.color : appStyles.secondaryText.color}} size={appStyles.h2.fontSize}/>
                <Text ref={ref} style={[appStyles.h6, {color: screen == 'CampaignsList' ? appStyles.primaryText.color : appStyles.secondaryText.color}]}>List</Text>
            </Pressable>
            <Pressable style={myStyles.button} onPress={() => navigation.navigate('Campaign',{id: '21'})}>
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
        maxHeight: 60,
        minHeight: 60,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
});

export default FooterBar;



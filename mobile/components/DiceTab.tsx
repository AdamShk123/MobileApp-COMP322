import { View, StyleSheet, Pressable, Text, Dimensions } from "react-native";
import appStyles from '../styles';
import { CampaignContext, TabParamList } from './Campaign';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import { useState, useContext } from "react";
import Slider from '@react-native-community/slider';
import { ServiceContext } from "../App";
import { useRealm } from "@realm/react";
import { Message } from "../models/Campaign";

type Props = {
    navigation: MaterialTopTabNavigationProp<TabParamList>;
}



const DiceTab = ({navigation}: Props) => {
    const [num, setNum] = useState(0);
    const [sides, setSides] = useState(20);

    const facadeService = useContext(ServiceContext);

    const campaign = useContext(CampaignContext);

    const realm = useRealm();

    const onPress = () => {
        const num = Math.ceil(Math.random() * sides);
        setNum(num);
        realm.write(() => {
            campaign?.chatRooms.at(0)?.messages.push({sent: "Gandalf", text: "Gandalf threw a D" + sides + " and got " + num + ".", time: new Date()} as Message);      
        });
    };

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <View style={myStyles.sliderView}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>{sides}</Text>
                <Slider value={20} vertical={true} step={1} minimumValue={4} maximumValue={20} style={myStyles.slider} thumbTintColor={'#F5B40F'} minimumTrackTintColor={'white'} maximumTrackTintColor={'white'} onValueChange={(value) => {
                    setSides(value);
                }}/>
            </View>
            <View style={myStyles.diceView}>
                <Text style={[appStyles.primaryText, appStyles.h1]}>{num}</Text>
                <Pressable style={[appStyles.secondaryBackground, myStyles.button]} onPress={onPress}>
                    <Text style={[appStyles.primaryText, appStyles.h4]}>Throw Die</Text>
                </Pressable>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'row',
    },
    diceView: {
        flex: 3,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: '20%',
    },
    sliderView: {
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
    },
    button: {
        width: '50%',
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    slider: {
        width: '180%',
        height: '60%',
        transform: [{rotate: '-90deg'}]
    }
});

export default DiceTab;

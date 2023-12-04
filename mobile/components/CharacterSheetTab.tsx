import { View, StyleSheet, Pressable, Text, Dimensions } from "react-native";
import appStyles from '../styles';
import { CampaignContext, TabParamList } from './Campaign';
import {MaterialTopTabNavigationProp} from '@react-navigation/material-top-tabs';
import { useState, useContext, useEffect } from "react";
import Slider from '@react-native-community/slider';
import { ServiceContext } from "../App";
import { useRealm } from "@realm/react";
import { Message } from "../models/Campaign";
import { Character } from "../models/Character";

type Props = {
    navigation: MaterialTopTabNavigationProp<TabParamList>;
}

const CharacterSheetTab = ({navigation}: Props) => {
    const [character, setCharacter] = useState<Character>();

    const facadeService = useContext(ServiceContext);

    const campaign = useContext(CampaignContext);

    const realm = useRealm();

    useEffect(() => {
        campaign?.characters.forEach((character) => {
            if(character.user_id == facadeService.getCurrentUser().id) {
                setCharacter(character);
            }
        });
    }, [campaign]);

    function getModifier(num: number): string {
        const result = -5 + num / 2;
        if(result >= 0) {
            return "+" + result;
        }
        return "" + result;
    }

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <View style={myStyles.columnView}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Strength: {character?.stats.str} | {getModifier(character?.stats.str!)}</Text>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Dexterity: {character?.stats.dex} | {getModifier(character?.stats.dex!)}</Text>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Constitution: {character?.stats.con} | {getModifier(character?.stats.con!)}</Text>
            </View>
            <View style={myStyles.columnView}>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Intelligence: {character?.stats.int} | {getModifier(character?.stats.int!)}</Text>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Wisdom: {character?.stats.wis} | {getModifier(character?.stats.wis!)}</Text>
                <Text style={[appStyles.primaryText, appStyles.h4]}>Charisma: {character?.stats.cha} | {getModifier(character?.stats.cha!)}</Text>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'row',
        padding: 5,
    },
    columnView: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
    }
});

export default CharacterSheetTab;

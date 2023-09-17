import React from 'react'
import {StyleSheet, Pressable, Text, View, FlatList} from 'react-native'
import appStyles from '../styles';         
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import HeaderBar from './HeaderBar';
import { useNavigation } from '@react-navigation/native';

type Props = {
    navigation: NativeStackNavigationProp<RootStackParamList>;
}

type Campaign = {
    campaignName: string;
    dmName: string;
}

const listData: Campaign[] = [
    {
        campaignName: 'The Unsleeping City',
        dmName: 'Brennan Lee Mulligan'
    },
    {
        campaignName: 'Escape from the Bloodkeep',
        dmName: 'Adam'
    },
    {
        campaignName: 'Arctopolis',
        dmName: 'Liam'
    },
];

const Item = ({campaignName, dmName}: Campaign) => {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return(
        <Pressable style={[appStyles.button, myStyles.button]} onPress={() => navigation.navigate('Campaign')}>
            <Text style={[appStyles.text, myStyles.text]}>{campaignName}</Text>
            <Text style={[appStyles.text, myStyles.text]}>{dmName}</Text>
        </Pressable>
    );
};

const CampaignsList = ({navigation}: Props) => {
    return (
        <View style={[appStyles.background,myStyles.componentView]}>
            <HeaderBar navigation={navigation} headerText={'Campaigns List'}/>
            <View style={myStyles.listView}>
                <FlatList data={listData} renderItem={({item}) => <Item campaignName={item.campaignName} dmName={item.dmName}/>}/>
            </View>
            <Pressable style={[appStyles.button, myStyles.addButton]} onPress={() => navigation.navigate('AddCampaign')}>
                <Text style={appStyles.text}>Add Campaign</Text>
            </Pressable>
        </View>
   );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
        flexDirection: 'column',
    },
    containerView: {
        minHeight: 50,
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'grey',
    },
    listView: {
        flex: 1,
        marginTop: 10,
        paddingLeft: 10,
        paddingRight: 10,
    },
    header: {
        color: 'black',
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'flex-start',
        padding: 2,
    },
    text: {
        marginRight: 15,
    },
    addButton: {
        maxHeight: 50,
        alignItems: 'center',
    }
});



export default CampaignsList;


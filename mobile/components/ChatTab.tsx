import { View, StyleSheet, FlatList, TextInput, Text, Button, Pressable } from "react-native";
import appStyles from '../styles';
import { CampaignContext, TabParamList } from './Campaign';
import { useContext, useEffect, useRef, useState } from "react";
import { ServiceContext } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { CampaignRealm, ChatRoom, Message } from "../models/Campaign";
import { useObject, useRealm } from "@realm/react";
import { Character } from "../models/Character";

type Props = NativeStackScreenProps<TabParamList, 'Chat'>;

type ItemProps = {
    sent: string;
    text: string;
    time: Date;
}

const Item = ({sent, text, time} : ItemProps) => {
    return (
        <View style={[myStyles.itemView, appStyles.secondaryBackground]}>
            <Text style={[appStyles.h4, appStyles.primaryText]}>{sent}</Text>
            <Text style={[appStyles.h4, appStyles.primaryText]}>{text}</Text>
            <Text style={[appStyles.h4, appStyles.primaryText]}>{time.getHours().toString() + ":" + time.getMinutes() + " " + (time.getMonth() + 1) + "/" + time.getDate()}</Text>
        </View>
    );
}

const ChatTab = ({route, navigation}: Props) => {
    const [list, setList] = useState<Message[]>([]);
    const [text, setText] = useState<string>('');
    const [added, setAdded] = useState<boolean>(false);
    const [last, setLast] = useState<CampaignRealm>();

    const facadeService = useContext(ServiceContext);

    const campaign = useContext(CampaignContext);

    const realm = useRealm();

    const listRef = useRef<Message[]>(list);
    const addedRef = useRef<boolean>(added);

    function onMessagesChange(a: any, b: any) {
        setList(a);
    }

    function onCharacterChange(a: Character, b: any) {
        if(b["changedProperties"][0] == "position") {
            realm.write(() => {
                campaign?.chatRooms.at(0)?.messages.push({sent: a.name, text: a.name + " moved to (" + a.position.x + ", " + a.position.y + ")", time: new Date()} as Message);      
            });
        }
    }

    useEffect(() => {
        console.log(campaign, added);
        if(campaign && !added || campaign?._id != last?._id) {
            console.log('campaig');
            campaign?.chatRooms.at(0)?.messages.addListener(onMessagesChange);
            campaign?.characters.forEach((character) => {
                character.addListener(onCharacterChange);
            });
            setAdded(true);
            setLast(campaign!);
        }
        console.log('here');
    }, [campaign]);

    function submit() {
        realm.write(() => {
            const character = campaign?.characters.filtered("user_id == $0", facadeService.getCurrentUser().id).at(0);
            campaign?.chatRooms.at(0)?.messages.push({sent: character?.name, text: text, time: new Date()} as Message);      
        });
    }

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <FlatList initialNumToRender={10} style={myStyles.listView} data={list} renderItem={(message) => <Item text={message.item.text} sent={message.item.sent} time={message.item.time}/>}/>
            <View style={myStyles.input}>
                <TextInput style={[myStyles.inputText, appStyles.h4]} onChangeText={(str) => setText(str)}/>
                <Pressable style={myStyles.inputButton} onPress={submit}>
                    <Text style={[appStyles.primaryText, appStyles.h4]}>Input</Text>
                </Pressable>
            </View>
        </View>
    );
};

const myStyles = StyleSheet.create({
    componentView: {
        flex: 1,
    },
    listView: {
        flex: 2,
    },
    itemView: {
        flex: 1,
        margin: 10, 
        borderColor: appStyles.primaryText.color,
        borderWidth: 2, 
    },
    input: {
        borderTopColor: appStyles.primaryText.color,
        borderTopWidth: 2,
        maxHeight: 50,
        flex: 1,
        flexDirection: 'row',
    },
    inputText: {
        flex: 3,
        color: appStyles.primaryText.color,
    },
    inputButton: {
        backgroundColor: appStyles.secondaryBackground.backgroundColor,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default ChatTab;

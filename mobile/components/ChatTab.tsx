import { View, StyleSheet, FlatList, TextInput, Text, Button, Pressable } from "react-native";
import appStyles from '../styles';
import { CampaignContext, TabParamList } from './Campaign';
import { useContext, useEffect, useRef, useState } from "react";
import { ServiceContext } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Message } from "../models/Campaign";
import { useRealm } from "@realm/react";

type Props = NativeStackScreenProps<TabParamList, 'Chat'>;

type ItemProps = {
    text: string;
}

const Item = ({text} : ItemProps) => {
    return (
        <View style={myStyles.itemView}>
            <Text style={[appStyles.h4, appStyles.primaryText]}>{text}</Text>
        </View>
    );
}

const ChatTab = ({route, navigation}: Props) => {
    const [list, setList] = useState<Message[]>([]);
    const [text, setText] = useState<string>('');

    const facadeService = useContext(ServiceContext);

    const campaign = useContext(CampaignContext);

    const realm = useRealm();

    function onDocumentChange(a: any, b: any) {
        // console.log(a);
        // console.log(b);
        setList(a);
    }

    useEffect(() => {
        // const messages: Message[] = [];
        // campaign?.chatRooms.at(0)?.messages.forEach((message) => {
        //     messages.push(message);
        // });
        // setList(messages);
        
        campaign?.chatRooms.at(0)?.messages?.addListener(onDocumentChange);
    }, [campaign]);

    function click() {
        console.log('hi');
        campaign?.chatRooms.at(0)?.messages.forEach((message) => {
            console.log(message.sent);
            console.log(message.text);
            console.log(message.time);
        });
    }

    function submit() {
        realm.write(() => {
            campaign?.chatRooms.at(0)?.messages.push({sent: "Gandalf", text: text, time: new Date()} as Message);      
        });
    }

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            {/* <Button title="button" onPress={click}></Button> */}
            <FlatList style={myStyles.listView} data={list} renderItem={(message) => <Item text={message.item.text}/>}/>
            <View style={myStyles.input}>
                <TextInput style={myStyles.inputText} onChangeText={(str) => setText(str)}/>
                <Pressable style={myStyles.inputButton} onPress={submit}>
                    <Text style={appStyles.primaryText}>Input</Text>
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
    }
});

export default ChatTab;

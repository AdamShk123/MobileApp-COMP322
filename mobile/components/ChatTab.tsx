import { View, StyleSheet, FlatList, TextInput, Text } from "react-native";
import appStyles from '../styles';
import { TabParamList } from './Campaign';
import { useContext, useEffect, useState } from "react";
import { ServiceContext } from "../App";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

type Props = NativeStackScreenProps<TabParamList, 'Chat'>;

const Item = () => {
    return (
        <View style={myStyles.itemView}>
            <Text style={[appStyles.h4, appStyles.primaryText]}>Hello</Text>
        </View>
    );
}

const ChatTab = ({route, navigation}: Props) => {
    const [list, setList] = useState<string[]>([]);

    const facadeService = useContext(ServiceContext);

    return (
        <View style={[appStyles.primaryBackground, myStyles.componentView]}>
            <FlatList style={myStyles.listView} data={list} renderItem={() => <Item/>}/>
            <TextInput style={myStyles.input}/>
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
        flex: 1,
    }
});

export default ChatTab;

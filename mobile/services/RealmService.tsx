import React from 'react';
import Realm, {ObjectSchema} from 'realm';
import {createRealmContext} from "@realm/react";
import {CampaignRealm, ChatRoom, Message} from '../models/Campaign';
import {Character, Stats, Status} from '../models/Character';
import { View } from 'react-native';

const realmConfig: Realm.Configuration = {
    schema: [CampaignRealm, ChatRoom, Message, Character, Status, Stats]
}

const {RealmProvider, useObject, useQuery, useRealm} = createRealmContext(realmConfig);

function AppWrapper() {
    return (
        <RealmProvider schema={realmConfig.schema}>
            <View></View>
        </RealmProvider>
    );
}


import Realm, { ObjectSchema } from "realm";
import {Character} from "./Character"

export class Message extends Realm.Object<Message> {
    sent!: string;
    time!: Date;
    text!: string;

    static schema: ObjectSchema = {
        name: 'Message',
        embedded: true,
        properties: {
            sent: 'string',
            time: 'date',
            text: 'string',
        }
    }

}

export class ChatRoom extends Realm.Object<ChatRoom> {
    _id!: Realm.BSON.ObjectId;
    name!: string;
    messages!: Realm.List<Message>;
    characters!: Realm.List<Character>

    static schema: ObjectSchema = {
        name: 'ChatRoom',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
            characters: 'Character[]',
            messages: {type: 'list', objectType: 'Message'}
        }
    }
}

export class CampaignRealm extends Realm.Object<CampaignRealm> {
    _id!: string;
    name!: string;
    created!: Date;
    characters!: Realm.List<Character>;
    chatRooms!: Realm.List<ChatRoom>;

    static schema: ObjectSchema = {
        name: 'CampaignRealm',
        primaryKey: '_id',
        properties: {
            _id: 'string',
            name: 'string',
            created: 'date',
            characters: 'Character[]',
            chatRooms: 'ChatRoom[]',
        }
    }
}

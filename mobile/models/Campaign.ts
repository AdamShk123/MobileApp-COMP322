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
    id!: Realm.BSON.ObjectId;
    name!: string;
    messages!: Realm.List<Message>;
    characters!: Realm.List<Character>

    static schema: ObjectSchema = {
        name: 'Campaign',
        properties: {
            id: 'objectId',
            name: 'string',
            characters: 'Character[]',
            messages: {type: 'list', objectType: 'Message'}
        }
    }
}

export class Campaign extends Realm.Object<Campaign> {
    id!: Realm.BSON.ObjectId;
    name!: string;
    created!: Date;
    characters!: Realm.List<Character>;
    chatRooms!: Realm.List<ChatRoom>;

    static schema: ObjectSchema = {
        name: 'Campaign',
        properties: {
            characters: 'Character[]',
            chatRooms: 'ChatRoom[]',
        }
    }
}
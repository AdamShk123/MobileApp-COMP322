import Realm, { ObjectSchema } from "realm";

export class Position extends Realm.Object<Position> {
    x!: number;
    y!: number;

    static schema: ObjectSchema = {
        name: 'Position',
        embedded: true, 
        properties: {
            x: 'int',
            y: 'int',
        }
    }
}

export class Stats extends Realm.Object<Stats> {
    str!: number;
    dex!: number;
    int!: number;
    wis!: number;
    con!: number;
    cha!: number;

    static schema: ObjectSchema = {
        name: 'Stats',
        embedded: true,
        properties: {
            str: 'int',
            dex: 'int',
            int: 'int',
            wis: 'int',
            con: 'int',
            cha: 'int',
        }
    }
};

export class Status extends Realm.Object<Status> {
    hp!: number;
    mp!: number;
    buffs!: Realm.List<string>;
    debuffs!: Realm.List<string>;

    static schema: ObjectSchema = {
        name: 'Status',
        embedded: true,
        properties: {
            hp: 'int',
            mp: 'int',
            buffs: {type: 'list', objectType: 'string'},
            debuffs: {type: 'list', objectType: 'string'},
        }
    }
}

export class Character extends Realm.Object<Character> {
    _id!: Realm.BSON.ObjectId;
    user_id!: string;
    name!: string;
    level!: number;
    class!: string;
    race!: string;
    stats!: Stats;
    status!: Status;
    position!: Position;
    abitilies!: Realm.List<string>;
    items!: Realm.List<string>;

    static schema: ObjectSchema = {
        name: 'Character',
        properties: {
            _id: 'objectId',
            user_id: 'string',
            name: 'string',
            level: 'int',
            class: 'string',
            race: 'string',
            stats: 'Stats',
            status: 'Status',
            position: 'Position',
            abilities: {type: 'list', objectType: 'string'},
            items: {type: 'list', objectType: 'string'},
            campaign: {type: 'linkingObjects', objectType: 'CampaignRealm', property: 'characters'}
        },
        primaryKey: '_id'
    }
}

/* campaigns collection, has a document for each campaign.
{
    name: 'BloodKeep',
    characters: [
        {
            id: wizard_id
            name: wizard
            position: (0,0)
            stats: {
                str: 10,
                dex: 10, 
                const: 10,
                int: 10,
                wis: 10,
                cha: 10,
                armor: 10,
                level: 10,
                class: 'Wizard'
            },
            status: {
                hp: 100,
                mp: 100,
                buffs: ['strength', 'quick']
                debuffs: ['madness']
            },
            abilities: [
                'magic missile',
                'icicle',
                'fireball',
                'heal'
            ]
        },
        {
            id: knight_id,
            name: knight,
            position: (30, 30),
        },
        {
            id: dragon_id,
            name: dragon,
            position: (100, 100),
        }
    ],
    npcs: [],
    enemies: [],
    chat_rooms: [
        {
            name: main
            messages: [
                {
                    sent_by: (id),
                    text: "Hello, World!"
                    datetime: ''
                },
                {
                    sent_by: (id),
                    text: "Hello, World!"
                    datetime: ''
                },
            ]
            characters: [all]
            npcs: []
            enemies: []
        }, 
        {
            name: knight-and-wizard
            messages: [
                {
                    sent_by: wizard_id,
                    text: "Hello, World!"
                    datetime: ''
                },
                {
                    sent_by: knight_id,
                    text: "Hello, World!"
                    datetime: ''
                },
            ]
            characters: [knight_id, wizard_id]
            npcs: []
            enemies: []
        }
    ]
}
*/

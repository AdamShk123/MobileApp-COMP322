import 'react-native-url-polyfill/auto';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { API_KEY, API_URL } from '@env';
import { decode } from 'base64-arraybuffer';

class DatabaseService {

    private url: string;
    private key: string;
    private supabase: SupabaseClient;

    private campaignChannel: any;

    constructor(){
        this.url = API_URL;
        this.key = API_KEY;
        this.supabase = createClient(this.url, this.key);
    }

    public subscribeCampaigns(callback: () => void): void {
        const channel = this.supabase.channel('campaignsList');
        channel.on('postgres_changes', {event: '*', schema: 'public', table: 'plays'}, (payload) => {
            callback();
        })
        channel.subscribe((status) => {
            if(status == 'SUBSCRIBED'){
                callback();
            }
        });
    }

    public subscribeNotifications(userID: string, callback: () => void) {
        const channel = this.supabase.channel('notifications');
        channel.on('postgres_changes', {event: '*', schema: 'public', table: 'invite'}, (payload) => {
            callback();
        })
        channel.subscribe((status) => {
            if(status == 'SUBSCRIBED'){
                callback();
            }
        });
    }

    public subscribeOnline(userID: string, callback: (presences: any) => void): void {
        const friends = this.supabase.channel('friendsList');
        friends.on('postgres_changes', {event: '*', schema: 'public', table: 'friend'}, (payload) => {
            callback([]);
        })
        friends.subscribe((status) => {
            if(status == 'SUBSCRIBED'){
                callback([]);
            }
        });

        const channel = this.supabase.channel('onlineStatus', {
            config: {
                presence: {
                    key: userID
                }
            }
        });
        channel.on('presence', {event: 'sync'}, () => {
            callback(channel.presenceState());
        }).on('presence', {event: 'join'}, ({key, newPresences}) => {
            callback(channel.presenceState());
        }).on('presence', {event: 'leave'}, ({key, leftPresences}) => {
            callback(channel.presenceState());
        });
        channel.subscribe((status) => {
            if(status == 'SUBSCRIBED'){
                // console.log('subscribed to the \'onlineStatus\' channel successfully');
                channel.track({online: true});
            }
        });
    }

    public subscribeCampaignOnline(campaignID: string, userID: string, callback: (presences: any) => void) {
        const channel = this.supabase.channel('campaign-' + campaignID, {
            config: {
                broadcast: {
                    self: true
                },
                presence: {
                    key: userID
                }
            }
        });
        
        channel.on('presence', {event: 'sync'}, () => {
            callback(channel.presenceState());
        }).on('presence', {event: 'join'}, ({key, newPresences}) => {
            callback(channel.presenceState());
            channel.send({type: 'broadcast', event: 'text', payload: {message: 'user' + userID + 'is connected!'}});
        }).on('presence', {event: 'leave'}, ({key, leftPresences}) => {
            callback(channel.presenceState());
            channel.send({type: 'broadcast', event: 'text', payload: {message: 'user' + userID + 'has left!'}});
        }).on('broadcast', {event: 'text'}, (payload) => {
            console.log(payload.payload.message);
        }).subscribe((status) => {
            if(status == 'SUBSCRIBED'){
                console.log('subscribed');
            }
        });

        this.campaignChannel = channel;
    }

    public async uploadImage(bucket: string, id: string, uri: string) : Promise<any> {
        return this.supabase.storage.from(bucket).upload(id +'/main.png', decode(uri), {contentType: 'image/png'});
    }

    public update(from: string, row: any): any{
        const query = this.supabase.from(from).update(row).select();
        return query; 
    }

    /**
    * API call to database, returning selected columns from selected table
    *  
    * @param from - selected table
    * @param select - selected columns
    * @returns the query object
    */
    public select(from: string, select: any): any {
        const query = this.supabase.from(from).select(select);
        return query;
    }

    public delete(from: string): any{
        const query = this.supabase.from(from).delete();
        return query;
    } 

    public insert(from: string, row: any): any{
        const query = this.supabase.from(from).insert(row).select();
        return query;
    }
    
    /**
    * API call to database, returning selected columns from selected table
    *  
    * @param query - initial query returned from select, update, insert, etc. functions
    * @param column - name of column to be checked
    * @param condition - conditional operator like 'eq' (=), 'neq' (!=), etc.
    * @param value - value being checked against
    * @returns the query object
    */
    public filter(query: any, column: string, condition: string, value: string): any {
        return query.filter(column, condition, value);
    }

    /**
    * API call to database, returning selected columns from selected table
    *  
    * @param query - initial query
    * @param column - name of column by which result will be ordered
    * @param ascending - if true, then values will start at lowest value and go to highest 
    * @returns the query object
    */
    public order(query: any, column: string, ascending: boolean): any{
        return query.order(column, {ascending: ascending});
    }
    
    /**
    * API call to database, returning selected columns from selected table
    *  
    * @param query - final query object
    * @returns the API call as a promise after calling await
    */
    public async await(query: any) : Promise<any> {
        const val = await query;
        return val;
    }

    /**
    * Creates user via the database authenticator
    *
    * @param email - email of new user 
    * @param password - password of new user
    * @returns a promise confirming creation of new user   
    */
    public async createUser(email: string, password: string): Promise<any>{
        const data = await this.supabase.auth.signUp({email, password});
        return data;
    }

    /**
    * Logs user in via the database authenticator
    *
    * @param email - email of new user 
    * @param password - password of new user
    * @returns a promise confirming login 
    */
    public async logIn(email: string, password: string): Promise<any> {
        const data = await this.supabase.auth.signInWithPassword({email, password});
        return data;
    }

    public async logOut() {
        const promise = await this.supabase.auth.signOut().then(() => {
            return this.supabase.removeAllChannels();
        });
        return promise;
    }
}

export default DatabaseService;



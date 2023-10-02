import 'react-native-url-polyfill/auto'

import { createClient, PostgrestSingleResponse, SupabaseClient } from '@supabase/supabase-js';
import { API_KEY, API_URL } from '@env';

class DatabaseService {

    private url: string;
    private key: string;
    private supabase: SupabaseClient;

    constructor(){
        this.url = API_URL;
        this.key = API_KEY;
        this.supabase = createClient(this.url, this.key);
    }

    public async getData(): Promise<PostgrestSingleResponse<any[]>> {
        const data = await this.supabase.from('player').select('*');
        return data;
    }

    public async createUser(email: string, password: string) : Promise<any>{
        const data = await this.supabase.auth.signUp({email, password});
        return data;
    }
}

export default DatabaseService;



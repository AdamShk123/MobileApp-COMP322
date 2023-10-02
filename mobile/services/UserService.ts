import { PostgrestSingleResponse } from "@supabase/supabase-js";
import DatabaseService from "./DatabaseService";

class UserService {
    constructor(private databaseService: DatabaseService) {}

    public getUsers() : Promise<PostgrestSingleResponse<any[]>>{
        return this.databaseService.getData();
    }

    public async createUser(email: string, password: string) : Promise<any>{
        return this.databaseService.createUser(email, password);
    }
}

export default UserService;

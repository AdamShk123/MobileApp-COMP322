import { PostgrestSingleResponse } from "@supabase/supabase-js";
import UserService from "./UserService";
import CampaignService from "./CampaignService";

class FacadeService {
    constructor(private userService: UserService, private campaignService: CampaignService){}

    public getUsers(): Promise<PostgrestSingleResponse<any[]>> {
        return this.userService.getUsers();
    }

    public async createUser(email: string, password: string) : Promise<any> {
        return this.userService.createUser(email, password);
    }
}

export default FacadeService;

import { PostgrestSingleResponse, SupabaseClient } from "@supabase/supabase-js";
import UserService from "./UserService";
import CampaignService from "./CampaignService";
import { CampaignType } from "../types/Campaign";
import { UserType } from "../types/User";
import DatabaseService from "./DatabaseService";

class FacadeService {
    constructor(private userService: UserService, private campaignService: CampaignService, private databaseService: DatabaseService){}

    public async createUser(email: string, password: string) : Promise<UserType> {
        const data = this.userService.createUser(email, password);
        return data;
    }

    public async logIn(email: string, password: string): Promise<UserType> {
        const data = this.userService.logIn(email, password);
        return data;
    }

    public async getUser(id: string) : Promise<UserType> {
        return this.userService.getUser(id);
    }

    public getCurrentUser() : UserType {
        return this.userService.currentUser;
    }

    public async getCampaigns(id: string): Promise<CampaignType[]> {
        return this.campaignService.getCampaigns(id);
    }

    public async getCampaign(id: string): Promise<CampaignType> {
        return this.campaignService.getCampaign(id);
    }

    public async updateCampaignPlayedData(campaignID: string): Promise<void> {
        return this.campaignService.updateCampaignPlayedData(campaignID,this.userService.currentUser.id);
    }

    public async createCampaign(row: any) : Promise<CampaignType> {
        return this.campaignService.createCampaign(row);
    }

    public Supabase(id: string, uri: string): void {
        this.databaseService.uploadImage(id, uri).then((result) => console.log(result));
    }
}

export default FacadeService;

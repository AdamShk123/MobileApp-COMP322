import DatabaseService from "./DatabaseService";
import { CampaignType } from "../types/Campaign";

class CampaignService {
    constructor(private databaseService: DatabaseService) {}

    // takes user id and gets all campaigns played by them
    public async getCampaigns(id: string) : Promise<CampaignType[]> {
        const initial = this.databaseService.select('plays','playerid,campaignid,campaign(cid,cname)');
        const filtered = this.databaseService.filter(initial, 'playerid', 'eq', id);
        const ordered = this.databaseService.order(filtered, 'campaignid', false);
        const transformed = this.databaseService.await(ordered).then((data) => {
            const dataSection : any[] = data['data'];
            const campaignsList : CampaignType[] = [];

            dataSection.forEach((item) => {
                campaignsList.push({name: item['campaign']['cname'], id: item['campaign']['cid'], created: item['campaign']['ccreated'], ongoing: item['campaign']['congoing']})
            });

            return campaignsList;
        });

        return transformed;
    }

    // takes campaign id and gets all data on that campaign
    public async getCampaign(id: string): Promise<CampaignType> {
        const initial = this.databaseService.select('campaign', '*');
        const filtered = this.databaseService.filter(initial, 'cid', 'eq', id);
        const transformed = this.databaseService.await(filtered).then((data) => {
            const item = data['data'][0];

            const campaign: CampaignType =  {name: item['cname'], id: item['cid'], created: item['ccreated'], ongoing: item['congoing']}
            
            return campaign;
        });

        return transformed;
    }

    public async updateCampaignPlayedData(campaignID: string, playerID: string): Promise<void>{
        const initial = this.databaseService.update('plays', {lastplayed: new Date()});
        const filtered1 = this.databaseService.filter(initial, 'playerid', 'eq', playerID);
        const filtered2 = this.databaseService.filter(filtered1, 'campaignid', 'eq', campaignID);
        const transformed = this.databaseService.await(filtered2);
        return transformed;
    }

    public async createCampaign(row: any): Promise<void>{
        const initial = this.databaseService.insert('campaign', row);
        const transformed = this.databaseService.await(initial).then((data) => {
            const item = data['data'][0];
            const initial = this.databaseService.insert('plays', {playerid: item['cdmid'], campaignid: item['cid']});
            const promise = this.databaseService.await(initial).then((data) => console.log(data));
            return promise;
        });
        return transformed;
    }
}

export default CampaignService;

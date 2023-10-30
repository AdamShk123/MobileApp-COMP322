import { CampaignType } from "./Campaign";
import { UserType } from "./User";

export type InviteType = {
    playerid: string;
    pid: string;
    cid: string;
    type: string;
    date: Date;
    pobject?: UserType;
    cobject?: CampaignType;
}

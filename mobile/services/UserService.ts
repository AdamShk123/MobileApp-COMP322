import DatabaseService from "./DatabaseService";
import {UserType} from "../types/User";
import {InviteType} from "../types/Invite";

class UserService {
    private _currentUser?: UserType;
    
    constructor(private databaseService: DatabaseService) {}

    public get currentUser() : UserType{
        return this._currentUser!;
    }  

    public async createUser(email: string, password: string) : Promise<UserType>{
        const data = this.databaseService.createUser(email, password);

        const transformed = data.then((data) => {
            const rawData = data['data']['user'];
            const user: UserType = {email: rawData['email'], id: rawData['id'], created: rawData['created_at'], first: 'test', last: 'test', nickname: 'test'};
            const query = this.databaseService.insert('player', {pid: user.id, pemail: user.email, pfirst: user.first, plast: user.last, pnickname: user.nickname, pcreated: user.created})
            this.databaseService.await(query);
            return user;
        });

        return transformed;
    }

    public async logIn(email: string, password: string): Promise<UserType> {
        const data = this.databaseService.logIn(email, password);

        const transformed = data.then((data) => {
            const rawData = data['data']['user'];
            
            const user: UserType = {email: rawData['email'], id: rawData['id'], created: rawData['created_at'], first: 'test', last: 'test', nickname: 'test'};
            this._currentUser = user; 
            return user;
        });

        return transformed;
    }

    public async getUser(id: string): Promise<UserType> {
        const initial = this.databaseService.select('player','*');
        const filtered = this.databaseService.filter(initial, 'pid', 'eq', id);

        const transformed = this.databaseService.await(filtered).then((data) => {
            const rawData = data['data'][0];
            
            const user: UserType = {email: rawData['pemail'], id: rawData['pid'], created: rawData['pcreated'], first: rawData['pfirst'], last: rawData['plast'], nickname: rawData['pnickname']}
        
            return user;
        });

        return transformed;
    }

    public async getFriends(id: string): Promise<UserType[]> {
        const initial = this.databaseService.select('friend','player!friend_playerid2_fkey(*)');
        const filtered = this.databaseService.filter(initial, 'playerid1', 'eq', id);

        const transformed = this.databaseService.await(filtered).then((data) => {
            const rawData : any[] = data['data'];
            const friendsList : UserType[] = [];
            rawData.forEach((item) => {
                friendsList.push({id: item['player']['pid'], email: item['player']['pemail'], nickname: item['player']['pnickname'], first: item['player']['pfirst'], last: item['player']['plast'], created: item['player']['pcreated']})
            });
            return friendsList;
        });

        return transformed;
    }

    public async searchUsers(searchText: string): Promise<UserType[]> {
        const initial = this.databaseService.select('player', '*');
        const filtered = this.databaseService.filter(initial, 'pemail', 'like', '%' + searchText + '%');

        const transformed = this.databaseService.await(filtered).then((data) => {
            const rawData: any[] = data['data'];
            const usersList : UserType[] = [];
            rawData.forEach((item) => {
                usersList.push({id: item['pid'], email: item['pemail'], nickname: item['pnickname'], first: item['pfirst'], last: item['plast'], created: item['pcreated']});
            });
            const filterFriends = this.getFriends(this.currentUser.id).then((list) => {
                return usersList.filter((item) => {
                    let check : boolean = true;
                    list.forEach((i) => {
                        if(item.id == i.id || item.id == this.currentUser.id){
                            check = false;
                        }
                    });
                    if(check){
                        return item;
                    }
                });
            });
            return filterFriends;
        });

        return transformed;
    }

    public async sendFriendInvite(list: UserType[]): Promise<void> {
        list.forEach((item) => {
            const initial = this.databaseService.insert('invite', {playerid: item.id, type: 'friend', pid: this.currentUser.id, cid: null});
            const transformed = this.databaseService.await(initial).then((data) => {
                console.log(data);    
            });
        });
    }

    public async getInvites(id: string = this.currentUser.id): Promise<InviteType[]> {
        const initial = this.databaseService.select('invite', '*');
        const filtered = this.databaseService.filter(initial, 'playerid', 'eq', id);

        const transformed = this.databaseService.await(filtered).then((data) => {
            console.log(data);
            const rawData = data['data'];
            const formatted : InviteType[] = [];
            rawData.forEach((item : any) => {
                this.getUser(item['pid']).then((value) => {
                    formatted.push({playerid: item['playerid'], pid: item['pid'], cid: item['cid'], date: item['date'], type: item['type'], pobject: value});
                    console.log(formatted);
                })
            });
            return formatted;
        });

        return transformed;
    }
}

export default UserService;

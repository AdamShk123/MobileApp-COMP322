import DatabaseService from "./DatabaseService";
import {UserType} from "../types/User";

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
        // const ordered = this.databaseService.order(filtered, 'plast', true);

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
            return usersList;
        });

        return transformed;
    }
}

export default UserService;

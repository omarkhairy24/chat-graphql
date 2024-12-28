import * as DataLoader from 'dataloader';
import { Injectable, Scope } from '@nestjs/common';
import { UsersService } from './users/users.service';
import { FriendsService } from './friends/friends.service';
import { GroupService } from './group/group.service';
// import { MessagesService } from './messages/chat.service';

@Injectable()
export class DataLoaderService {
    constructor(
        private userService: UsersService,
        private chatService: FriendsService,
        private groupService: GroupService
        // private messageService: MessagesService,
        
    ){}

    public userLoader = new DataLoader(async (usersIds:string[])=>{
        const users = await this.userService.findAll(usersIds);
        const userMap = new Map(users.map((user) => [user.id, user]));
        return usersIds.map((id) => userMap.get(id));
    });


    public chatRoomLoader = new DataLoader(async (chatIds:number[])=>{
        const chatRooms = await this.chatService.findByIds(chatIds);
        const chatsMap = new Map((chatRooms.map((chat)=> [chat.id,chat])));
        return chatIds.map((id)=> chatsMap.get(id));
    });

    // public messageLoader = new DataLoader(async (chatIds:number[])=>{
    //     const messages = await this.messageService.getMessages(chatIds);
    //     const messagesMap = new Map(messages.map((message)=> [message.id,message]));
    //     return chatIds.map((id)=> messagesMap.get(id));
    // });

    public groupMemberLoader = new DataLoader(async (groupIds:number[])=>{
        const groupMembers = await this.groupService.findMembresByIds(groupIds);
        const memberMap = new Map();
        groupMembers.forEach(member=>{
            if(!memberMap.has(member.groupId)){
                memberMap.set(member.groupId, [])
            }
            memberMap.get(member.groupId).push(member)
        })
        
        return groupIds.map((id)=> memberMap.get(id)||[]);
    })

}

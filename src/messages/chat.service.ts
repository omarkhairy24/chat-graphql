import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Messages } from './messages.entity';
import {Sequelize} from 'sequelize-typescript'
import { QueryTypes } from 'sequelize';
import { FriendsService } from 'src/friends/friends.service';
import { GroupService } from 'src/group/group.service';

@Injectable()
export class MessagesService {
    constructor(
        @InjectModel(Messages) private messages: typeof Messages,
        private chat: FriendsService,
        private groupService: GroupService,
        private sequelize: Sequelize
    ){}

    async sendMessage(
        senderId:string,
        // receiverId:string,
        chatId:number,
        content:string, 
        images:string[]){
        // const chat = await this.chat.find(senderId,receiverId);
        const chat = await this.chat.findById(chatId);
        if(!chat) throw new NotFoundException('The user is not in your friends list. Please ensure you have added them as a friend.');
        
        if(!content && !images) throw new BadRequestException('you must provide content or image');

        const message = await this.messages.create({
            chatId:chat.id,
            senderId:senderId,
            content:content,
            images:images || [],
        })
        
        return message;
    }

    async sendGroupMessage(senderId:string,groupId:number,content:string, images:string[] ){
        const group = await this.groupService.findGroup(groupId)
        if(!group) throw new NotFoundException('group not found.');

        const user = await this.groupService.findUser(groupId,senderId);

        if(!user) throw new BadRequestException('you are not member of this group.');

        if(!content && !images) throw new BadRequestException('you must provide content or image');

        const message = await this.messages.create({
            groupId:group.id,
            senderId:senderId,
            content:content,
            images:images || [],
        })
        
        return message;
    }

    async getChats(userId:string){
        return this.chat.getChats(userId)
    }

    async getChat(userId:string,friendId:string){
        
        const chat = await this.sequelize.query(`
                SELECT chatRooms.id, users.id as user_id,users.name, users.username, users.image
                FROM chatRooms
                JOIN users ON (users.id = chatRooms.userId AND users.id <> ?)
                    OR (users.id = chatRooms.friendId AND users.id <> ?)
                WHERE (chatRooms.userId = ? AND chatRooms.friendId = ?)
                    OR (chatRooms.userId = ? AND chatRooms.friendId = ?)
            `,{
                replacements: [userId, userId, userId, friendId, friendId, userId],
                type: QueryTypes.SELECT,
        });
        
        // const chat = await this.chat.findById(chatId);
        if(!chat) throw new NotFoundException('chat not found');
        const messages = await this.messages.findAll({
            where:{
                //@ts-ignore
                chatId:chat[0].id
            },
            order: [['createdAt', 'DESC']]
        });

        return {ChatInfo:chat[0],messages:messages}
    }
    
}

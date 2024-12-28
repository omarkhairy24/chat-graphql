import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FriendRequests } from './friendRequest.entity';
import { ChatRoom } from './chat.entity';
import { Op } from 'sequelize';

@Injectable()
export class FriendsService {
    constructor(
        @InjectModel(FriendRequests) private fReq: typeof FriendRequests,
        @InjectModel(ChatRoom) private friends: typeof ChatRoom
    ){}

    async getRequestsByUsersIds(userIds:string[]){
        const requests = await this.fReq.findAll({
            where:{
                senderId:userIds
            }
        });

        return requests;
    }

    async getChats(userId:string){
        const chats = await this.friends.findAll({
            where:{
                [Op.or]:[
                    {userId:userId},
                    {friendId:userId}
                ]
            }
        });
        return chats;
    }

    async findByIds(ids:number[]){
        return await this.friends.findAll({
            where:{
                id:ids
            }
        })
    }

    async findById(chatId:number){
        const chat = await this.friends.findByPk(chatId);
        return chat
    }

    async find(senderId:string, receiverId:string){
        const chat = await this.friends.findOne({
            where:{
                [Op.or]:[
                    {userId:senderId ,friendId:receiverId},
                    {userId:receiverId ,friendId:senderId}
                ]
            }
        });

        return chat;
    }

    async sendFriendRequest(senderId:string, receiverId:string){

        const friend = await this.friends.findOne({
            where:{
                [Op.or]:[
                    {userId:senderId ,friendId:receiverId},
                    {userId:receiverId ,friendId:senderId}
                ]
            }
        });

        if(friend) throw new BadRequestException('You are already friends with this user.');

        const req = await this.fReq.findOne({
            where:{
                [Op.or]:[
                    {senderId:senderId ,receiverId:receiverId},
                    {senderId:receiverId ,receiverId:senderId}
                ]
            }
        });

        if(req) throw new BadRequestException('A friend request between you and this user already exists.');

        await this.fReq.create({
            senderId:senderId,receiverId:receiverId
        });

        return 'request sent';
    }

    async getMyPendings(userId:string){
        const pendings = await this.fReq.findAll({
            where:{
                receiverId:userId
            }
        });

        return pendings;
    }

    async getMyRequests(userId:string){
        const requests = await this.fReq.findAll({
            where:{
                senderId:userId
            }
        });

        return requests;
    }

    async acceptRequest(receiverId:string,senderId:string){

        const request = await this.fReq.findOne({
            where:{
                senderId:senderId ,receiverId:receiverId
            }
        });

        if(!request) throw new NotFoundException('Request not found.');

        const [accepted,destroyed] = await Promise.all([
            this.friends.create({
                userId:senderId,
                friendId:receiverId
            }),
            request.destroy()
        ]);

        return 'request accepted';
    }

    async rejectRequest(receiverId:string,senderId:string){
        const request = await this.fReq.findOne({
            where:{
                senderId:senderId ,receiverId:receiverId
            }
        });

        if(!request) throw new NotFoundException('Request not found.');

        await request.destroy();

        return 'rejected';
    }

    async getRequestsByIds(ids:number[]){
        return await this.fReq.findAll({
            where:{
                id:ids
            }
        })
    }
}

import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from "@nestjs/graphql";
import { MessagesService } from "./chat.service";
import { Chat, SingleChat } from "./dto/chat.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { UploadService } from "src/upload.service";
import {PubSub} from 'graphql-subscriptions'
import { DataLoaderService } from "src/loader.service";
import { UserResponse } from "src/users/dto/user.dto";
import { User } from "src/users/user.entity";
import { ChatRoom } from "src/friends/chat.entity";

const pubSub = new PubSub();

@Resolver(()=>Chat)
export class Chatesolver {
    constructor(
        private messageService: MessagesService,
        private uploadService: UploadService,
        private LoaderService:DataLoaderService
    ){}

    @Query(()=> SingleChat)
        @UseGuards(JwtAuthGuard)
        async getChat(
            @Context('req') req:any,
            @Args('friendId') friendId:string
        ){
            const chat = await this.messageService.getChat(req.user.id,friendId);
            return chat
        }

    
    @Query(()=>[Chat])
    @UseGuards(JwtAuthGuard)
    async getChats(
        @Context('req') req:any
    ){
        return await this.messageService.getChats(req.user.id);
    }

    
    @ResolveField('user',()=> User)
    async user(@Parent() chat:ChatRoom){
        return this.LoaderService.userLoader.load(chat.userId)
    }

    @ResolveField('friend',()=> User)
    async friend(@Parent() chat:ChatRoom){
        return this.LoaderService.userLoader.load(chat.friendId)
    }
}
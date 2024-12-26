import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from "@nestjs/graphql";
import { MessagesService } from "./chat.service";
import { Chat, Message, SingleChat } from "./dto/chat.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { UploadService } from "src/upload.service";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import {PubSub} from 'graphql-subscriptions'
import { Messages } from "./messages.entity";
import { DataLoaderService } from "src/loader.service";
import { UserResponse } from "src/users/dto/user.dto";

const pubSub = new PubSub();

@Resolver(()=>Message)
export class MessageResolver {
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
    
    @ResolveField('sender',()=>UserResponse)
    async sender(@Parent() messages:Messages){
        return await this.LoaderService.userLoader.load(messages.senderId);
    }

    
    @Mutation(()=> Message ,{name:'sendMessage'})
    @UseGuards(JwtAuthGuard)
    async sendMessage(
        @Context('req') req:any,
        // @Args('receiverId') receiverId:string,
        @Args('chatId') chatId:number,
        @Args('content') content:string,
        @Args({name:'files' , type:() =>[GraphQLUpload],nullable:true}) files:FileUpload[]

    ){
        let images = await this.uploadService.uploadImages(files);
        const message = await this.messageService.sendMessage(req.user.id, chatId,content,images);

        await pubSub.publish('newMessage', { newMessage: message });

        return message
    }

    @Subscription(()=>Message,{
        filter: (payload, variables)=> payload.newMessage.chatId === variables.chatId
    })
    newMessage(@Args('chatId') chatId: number){
        return pubSub.asyncIterableIterator('newMessage');
    }

}
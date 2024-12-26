import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { FriendsService } from "./friends.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { FriendRequests } from "./friendRequest.entity";
import { DataLoaderService } from "src/loader.service";
import { UserResponse } from "src/users/dto/user.dto";

@Resolver(()=>FriendRequests)
export class FriendReqResolver {
    constructor(
        private friendService:FriendsService,
        private loaderService: DataLoaderService
    ){}

    @Query(()=>[FriendRequests])
    @UseGuards(JwtAuthGuard)
    async getPendings(
        @Context('req') req:any
    ){
        return this.friendService.getMyPendings(req.user.id);
    }

    @ResolveField('sender',()=>UserResponse)
    async sender(@Parent() request:FriendRequests){
        return this.loaderService.userLoader.load(request.senderId)
    }

    @ResolveField('reciever',()=>UserResponse)
    async reciever(@Parent() request:FriendRequests){
        return this.loaderService.userLoader.load(request.receiverId)
    }

    @Query(()=>[FriendRequests])
    @UseGuards(JwtAuthGuard)
    async getMyRequests(
        @Context('req') req:any
    ){
        return this.friendService.getMyRequests(req.user.id);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(()=>String , {name:'sendRequest'})
    async sendRequest(@Context('req') req:any , @Args('receiverId') receiverId:string){
        return this.friendService.sendFriendRequest(req.user.id,receiverId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(()=>String , {name:'acceptRequest'})
    async accept(@Context('req') req:any , @Args('senderId') senderId:string){
        return this.friendService.acceptRequest(req.user.id,senderId);
    }

    @UseGuards(JwtAuthGuard)
    @Mutation(()=>String , {name:'rejectRequest'})
    async reject(@Context('req') req:any , @Args('senderId') senderId:string){
        return this.friendService.rejectRequest(req.user.id,senderId);
    }
}
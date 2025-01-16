import { Args, Context, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { FollowEntity } from "./follow.entity";
import { FollowService } from "./follow.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { UserResponse } from "src/users/dto/user.dto";
import { UsersService } from "src/users/users.service";

@Resolver(()=>FollowEntity)
export class FollowResolver {

    constructor(
        private followService:FollowService,
        private userService:UsersService
    ){}

    @ResolveField('followerUser',()=>UserResponse)
    async followerUser(
        @Parent() follow:FollowEntity
    ){  
        return await this.userService.userLoader.load(follow.followerId)
    }

    @ResolveField('followingUser',()=>UserResponse)
    async followingUser(
        @Parent() follow:FollowEntity
    ){
        return await this.userService.userLoader.load(follow.followingId)
    }

    @Mutation(()=>FollowEntity)
    @UseGuards(JwtAuthGuard)
    async follow(
        @Context('req') req:any,
        @Args('followingId') followingId:string
    ){
        return this.followService.follow(req.user.id,followingId)
    }

    @Mutation(()=>String)
    @UseGuards(JwtAuthGuard)
    async unFollow(
        @Context('req') req:any,
        @Args('followingId') followingId:string
    ){
        return this.followService.unFollow(req.user.id,followingId)
    }
}
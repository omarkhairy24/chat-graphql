import { Args, Context, Mutation, Parent, ResolveField, Resolver } from "@nestjs/graphql";
import { GroupService } from "./group.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { UserResponse } from "src/users/dto/user.dto";
import { GroupUsers } from "./group.users.entity";
import { UsersService } from "src/users/users.service";


@Resolver(()=>GroupUsers)
export class GroupMemberResolver {
    constructor(
        private groupService: GroupService,
        private userService: UsersService
    ){}

    @ResolveField('user',()=>UserResponse)
    async user(@Parent() groupUsers:GroupUsers){
        return await this.userService.userLoader.load(groupUsers.userId);
    }

    @Mutation(()=>[UserResponse])
    @UseGuards(JwtAuthGuard)
    async addMemberSearch(
        @Args('groupId') groupId:number,
        @Args('query') query:string
    ){
        return this.groupService.addMemberSearch(groupId,query)
    }

    @Mutation(()=>UserResponse)
    @UseGuards(JwtAuthGuard)
    async addMember(
        @Context('req') req:any,
        @Args('groupId') groupId:number,
        @Args('userId') userId:string
    ){
        return this.groupService.addGroupMembers(req.user.id,groupId,userId);
    }

    @Mutation(()=>UserResponse)
    @UseGuards(JwtAuthGuard)
    async addAdmin(
        @Context('req') req:any,
        @Args('groupId') groupId:number,
        @Args('memberId') memberId:string
    ){
        return this.groupService.addAdmin(req.user.id,groupId,memberId);
    }

    @Mutation(()=>UserResponse)
    @UseGuards(JwtAuthGuard)
    async removeMember(
        @Context('req') req:any,
        @Args('groupId') groupId:number,
        @Args('memberId') memberId:string
    ){
        return this.groupService.removeMember(req.user.id,groupId,memberId);
    }
}
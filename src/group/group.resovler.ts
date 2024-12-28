import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { Group } from "./group.entity";
import { GroupService } from "./group.service";
import { UploadService } from "src/upload.service";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { UserResponse } from "src/users/dto/user.dto";
import { DataLoaderService } from "src/loader.service";
import { GroupUsers } from "./group.users.entity";


@Resolver(()=>Group)
export class GroupResolver {
    constructor(
        private groupService: GroupService,
        private uploadService: UploadService,
        private loaderService: DataLoaderService
    ){}

    @Query(()=>[Group])
    @UseGuards(JwtAuthGuard)
    async getGroups(
        @Context('req') req:any,
    ){
        return this.groupService.getGroups(req.user.id);
    }

    @Query(()=>Group)
    @UseGuards(JwtAuthGuard)
    async group(
        @Context('req') req:any,
        @Args('groupId') groupId:number
    ){
        return this.groupService.getGroup(groupId,req.user.id);
    }

    @ResolveField('members',()=>[GroupUsers])
    async members(@Parent() group:Group){
        return await this.loaderService.groupMemberLoader.load(group.id);
    }

    @ResolveField('user',()=>[UserResponse])
    async user(@Parent() groupUsers:GroupUsers){
        return await this.loaderService.userLoader.load(groupUsers.userId);
    }

    @Mutation(()=>Group)
    @UseGuards(JwtAuthGuard)
    async createGroup(
        @Context('req') req:any,
        @Args('name') name:string,
        @Args('file',{type:()=>GraphQLUpload}) file:FileUpload
    ){
        const image = await this.uploadService.uploadFile(file);
        return this.groupService.creataGroup(req.user.id,name,image)
    }

}
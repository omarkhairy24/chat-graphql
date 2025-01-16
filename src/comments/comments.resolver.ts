import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { CommentsEntity } from "./comments.entity";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { CommentsService } from "./comments.service";
import { UserResponse } from "src/users/dto/user.dto";
import { Comments } from "./dto/comment.dto";
import { UsersService } from "src/users/users.service";

@Resolver(()=>Comments)
export class CommentsResolver {

    constructor(
        private commentService:CommentsService,
        private userService:UsersService
    ){}

    @Query(()=>CommentsEntity)
    async find(){}

    @ResolveField('user',()=> UserResponse)
    async user(
        @Parent() comment:Comments,
    ){
        return await this.userService.userLoader.load(comment.userId)
    }

    @Mutation(()=>CommentsEntity)
    @UseGuards(JwtAuthGuard)
    async addComment(
        @Context('req') req:any,
        @Args('postId') postId:number,
        @Args('content') content:string
    ){
        return this.commentService.addComment(req.user.id,postId,content);
    }

    @Mutation(()=>CommentsEntity)
    @UseGuards(JwtAuthGuard)
    async updateComment(
        @Context('req') req:any,
        @Args('commentId') commentId:number,
        @Args('content') content:string
    ){
        return this.commentService.updateComment(req.user.id,commentId,content);
    }


    @Mutation(()=>String)
    @UseGuards(JwtAuthGuard)
    async deleteComment(
        @Context('req') req:any,
        @Args('commentId') commentId:number,
    ){
        return this.commentService.deleteComment(req.user.id,commentId);
    }

}
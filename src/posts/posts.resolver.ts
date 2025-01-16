import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { PostsEntity } from "./posts.entity";
import { PostsService } from "./posts.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";
import { postInput } from "./dto/create.post.dto";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { UploadService } from "src/upload.service";
import { Post } from "./dto/post.dto";
import { UserResponse } from "src/users/dto/user.dto";
import { LikesService } from "src/likes/likes.service";
import { Comments } from "src/comments/dto/comment.dto";
import { UsersService } from "src/users/users.service";
import { CommentsService } from "src/comments/comments.service";

@Resolver(()=>Post)
export class PostResolver {
    constructor(
        private postService:PostsService,
        private uploadService:UploadService,
        private userService:UsersService,
        private likeService:LikesService,
        private commentService:CommentsService
    ){}

    @Query(()=>[Post])
    @UseGuards(JwtAuthGuard)
    async feed(
        @Context('req') req:any
    ){
        return this.postService.feed(req.user.id)
    }

    @Query(()=>Post)
    @UseGuards(JwtAuthGuard)
    async getPost(
        @Args('postId') postId:number
    ){
        return this.postService.findOne(postId)
    }

    @ResolveField('user',()=>UserResponse)
    async user(
        @Parent() post:Post
    ){
        return await this.userService.userLoader.load(post.userId);
    }

    @ResolveField('likes',()=>Number)
    async likes(
        @Parent() post:PostsEntity
    ){
        return await this.likeService.likeCount(post.id);
    }

    @ResolveField('comments',()=>Comments)
    async comments(
        @Parent() post:PostsEntity,
        @Args('page') page:number
    ){
        return await this.commentService.commentLoader.load({postIds:post.id, page});
    }

    @ResolveField('isLiked',()=>Boolean)
    async isLiked(
        @Context('req') req:any,
        @Parent() post:Post
    ){
        return await this.likeService.isLiked(req.user.id,post.id)
    }

    @Mutation(()=>Post,{name:'createPost'})
    @UseGuards(JwtAuthGuard)
    async createPost(
        @Context('req') req:any,
        @Args({name:'files' , type:() =>[GraphQLUpload],nullable:true}) files:FileUpload[],
        @Args('input') input:postInput
    ){
        let images = await this.uploadService.uploadImages(files);
        //@ts-ignore
        input.images = images;
        return this.postService.addPost(req.user.id,input);
    }

    @Mutation(()=>Post,{name:'updatePost'})
    @UseGuards(JwtAuthGuard)
    async updatePost(
        @Context('req') req:any,
        @Args('postId') postId:number,
        @Args({name:'files' , type:() =>[GraphQLUpload],nullable:true}) files:FileUpload[],
        @Args('input',{nullable:true}) input:postInput
    ){
        let images = await this.uploadService.uploadImages(files);
        if(images.length > 0){
            input.images = images;
        }
        return this.postService.updatePost(req.user.id,postId,input);
    }

    @Mutation(()=>String)
    @UseGuards(JwtAuthGuard)
    async deletePost(
        @Context('req') req:any,
        @Args('postId') postId:number,
    ){
        return this.postService.deletePost(req.user.id,postId);
    }
}
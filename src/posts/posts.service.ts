import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { PostsEntity } from './posts.entity';
import { postInput } from './dto/create.post.dto';
import * as fs from 'fs';
import { FollowService } from 'src/follow/follow.service';

@Injectable()
export class PostsService {
    constructor(
        @InjectModel(PostsEntity) private repo:typeof PostsEntity,
        private followService:FollowService
    ){}

    async feed(userId:string){
        const following = await this.followService.userFollowing(userId);
        const followings = following.map(follow => follow.followingId);
        const posts = await this.repo.findAll({
            where:{
                userId:followings
            },
            order:[['createdAt','DESC']]
        });

        return posts
    }

    async PostsCount(userId:string){
        const posts = await this.repo.findAll({
            where:{
                userId
            }
        });

        return posts.length;
    }

    async findOne(
        postId:number
    ){
        return await this.repo.findByPk(postId)
    }

    async getPostsCount(
        userId:string
    ){
        const posts = await this.repo.findAll({
            where:{
                userId
            }
        });

        return posts.length;
    }

    async addPost(
        userId:string,
        input:postInput
    ){
        if(!input.content && !input.images) throw new BadRequestException('you must provide content or image');
        const post = await this.repo.create({
            userId,
            content:input.content,
            images: input.images || []
        });

        return post
    }


    async updatePost(
        userId:string,
        postId:number,
        input:postInput
    ){
        const post = await this.repo.findOne({
            where:{
                id:postId
            }
        });
        if(!post) throw new NotFoundException('post not found');
        if(post.userId !== userId) throw new BadRequestException('You can only modify posts that you own.');

        if(input.images){
            if(post.images.length !== 0){
                post.images.forEach(image=>{
                    fs.unlinkSync(`uploads/${image}`)
                });
            };
        };
        post.set(input);
        await post.save();
        return post
    }

    async deletePost(
        userId:string,
        postId:number
    ){
        const post = await this.repo.findOne({
            where:{
                id:postId
            }
        });

        if(!post) throw new NotFoundException('post not found');
        if(post.userId !== userId) throw new BadRequestException('You can only delete posts that you own.');

        if(post.images.length !== 0){
            post.images.forEach(image=>{
                fs.unlinkSync(`uploads/${image}`);
            });
        };

        await post.destroy();

        return 'post deleted successfully';
    }
}

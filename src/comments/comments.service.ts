import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { CommentsEntity } from './comments.entity';
import { PostsService } from 'src/posts/posts.service';
import * as DataLoader from 'dataloader';


@Injectable()
export class CommentsService {

    constructor(
        @InjectModel(CommentsEntity) private repo:typeof CommentsEntity,
        private postService:PostsService
    ){}

    async findAll(
        postIds:number[],
        page:number
    ){
        if (page < 1) throw new BadRequestException('Page number must be 1 or greater.');
        return await this.repo.findAll({
            where:{
                postId:postIds
            },
            offset:(page -1) * 10,
            limit:10
        })
    }

    public commentLoader = new DataLoader(async (attrs:{postIds:number , page:number}[])=>{
        const postIds = attrs.map(att=> att.postIds);
        const page = attrs.map(att => att.page);        
        const comments = await this.findAll(postIds,page[0]);
                
        const commentsMap = new Map();
        comments.forEach( comment =>{
            if(!commentsMap.has(comment.postId)){
                commentsMap.set(comment.postId,[])
            }
            commentsMap.get(comment.postId).push(comment)
        });
                            
        return postIds.map((id)=> commentsMap.get(id.toString()) ||[]);
    });

    async addComment(
        userId:string,
        postId:number,
        content:string
    ){
        const post = await this.postService.findOne(postId);
        if(!post) throw new NotFoundException('post not found');
        if(!content || content.trim().length === 0) throw new BadRequestException('The comment must contain at least one non-whitespace character.');
        return await this.repo.create({
            userId,
            postId,
            content
        });
    }

    async updateComment(
        userId:string,
        commentId:number,
        content:string
    ){
        const comment = await this.repo.findOne({
            where:{
                id:commentId
            }
        });

        if(!comment) throw new NotFoundException('comment not found');
        if(comment.userId !== userId) throw new BadRequestException('You can only modify comments that you own.');

        comment.set({
            content
        });
        await comment.save();

        return comment;
    }

    async deleteComment(
        userId:string,
        commentId:number,
    ){
        const comment = await this.repo.findOne({
            where:{
                id:commentId
            }
        });

        if(!comment) throw new NotFoundException('comment not found');
        if(comment.userId !== userId) throw new BadRequestException('You can only delete comments that you own.');


        await comment.destroy();

        return 'comment deleted';
    }
}

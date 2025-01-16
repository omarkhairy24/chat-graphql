import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { LikeEntity } from './likes.entity';

@Injectable()
export class LikesService {

    constructor(
        @InjectModel(LikeEntity) private repo: typeof LikeEntity
    ){}

    async isLiked(
        userId:string,
        postId:number
    ){
        const isLiked = await this.repo.findOne({
            where:{
                userId,
                postId
            }
        });

        return isLiked ? true : false
    }

    async likeCount(postId:number){
        const likes = await this.repo.findAll({
            where:{
                postId
            }
        });

        return likes.length;
    }

    async like(
        userId:string,
        postId:number
    ){
        const isLiked = await this.repo.findOne({
            where:{
                userId,
                postId
            }
        });

        if(isLiked) {
            await isLiked.destroy();
            return false;
        }else{
            await this.repo.create({
                userId,
                postId
            });
            return true;
        }
    }
}

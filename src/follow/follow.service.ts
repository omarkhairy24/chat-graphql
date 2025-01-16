import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { FollowEntity } from './follow.entity';
import * as DataLoader from 'dataloader';


@Injectable()
export class FollowService {
    constructor(
        @InjectModel(FollowEntity) private repo:typeof FollowEntity
    ){}

    async follow(
        userId:string,
        followingId:string
    ){

        if(userId === followingId) throw new NotAcceptableException('You cannot follow yourself.');

        let follow = await this.repo.findOne({
            where:{
                followerId:userId,
                followingId
            }
        });

        if(follow) throw new BadRequestException('you already follow this user');

        follow = await this.repo.create({
            followerId:userId,
            followingId
        });

        return follow
    }

    async unFollow(
        userId:string,
        followingId:string
    ){
        const follow = await this.repo.findOne({
            where:{
                followerId:userId,
                followingId
            }
        });
        if(!follow) throw new NotFoundException();

        await follow.destroy();
        return 'removed';
    }


    async followerCount(followingId:string){
        const followerCount = await this.repo.findAll({
            where:{
                followingId
            }
        });

        return followerCount.length;
    }

    async userFollowing(followerId:string){
        return await this.repo.findAll({
            where:{
                followerId
            }
        })
    }

    async followingCount(followerId:string){
        const followingCount = await this.repo.findAll({
            where:{
                followerId
            }
        });

        return followingCount.length;
    }

    async followers(followingsId:string[]){
        return await this.repo.findAll({
            where:{
                followingId:followingsId
            }
        })
    }

    async following(followersId:string[]){
        return await this.repo.findAll({
            where:{
                followerId:followersId
            }
        })
    }


    public followersLoader = new DataLoader(async (followingIds: string[]) => {
        const followers = await this.followers(followingIds);
        const followersMap = new Map();
            
        followers.forEach(follower => {
            if (!followersMap.has(follower.followingId)) {
                followersMap.set(follower.followingId, []);
            }
            followersMap.get(follower.followingId).push(follower);
        });
        return followingIds.map((id) => followersMap.get(id) || []);
    })
    
    public followingLoader = new DataLoader(async (followerIds: string[]) => {
        const following = await this.following(followerIds);
        const followingMap = new Map();
            
        following.forEach(follow => {
            if (!followingMap.has(follow.followerId)) {
                  followingMap.set(follow.followerId, []);
            }
            followingMap.get(follow.followerId).push(follow);
        });
        return followerIds.map((id) => followingMap.get(id) || []);
    });
}

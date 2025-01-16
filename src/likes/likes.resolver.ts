import { Args, Context, Mutation, Query, Resolver } from "@nestjs/graphql";
import { LikeEntity } from "./likes.entity";
import { LikesService } from "./likes.service";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "src/users/guard/GqlAuthGuard";

@Resolver(()=>LikeEntity)
export class LikeResolver{

    constructor(
        private likeService: LikesService
    ){}

    @Query(()=>LikeEntity)
    async find(){}

    @Mutation(()=>Boolean)
    @UseGuards(JwtAuthGuard)
    async like(
        @Context('req') req:any,
        @Args('postId') postId:number
    ){
        return this.likeService.like(req.user.id,postId)
    }
}
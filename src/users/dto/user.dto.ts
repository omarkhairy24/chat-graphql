import { Field, ObjectType } from "@nestjs/graphql";
import { FollowEntity } from "src/follow/follow.entity";

@ObjectType()
export class UserResponse{
    @Field()
    id:string;

    @Field()
    username:string;

    @Field()
    name:string;

    @Field()
    email:string;

    @Field({nullable:true})
    image:string;

    @Field({nullable:true})
    bio:string;

    @Field()
    postCount:number;

    @Field()
    followerCount:number;

    @Field()
    followingCount:number;

    @Field(()=>[FollowEntity],{nullable:true})
    followers:FollowEntity[];

    @Field(()=>[FollowEntity],{nullable:true})
    following:FollowEntity[];
}

@ObjectType()
export class LoginResponse {
    
    @Field()
    token:string;

    @Field(()=>UserResponse)
    user:UserResponse
}
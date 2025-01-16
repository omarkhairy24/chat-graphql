import { Field, ObjectType } from "@nestjs/graphql";
import { UserResponse } from "src/users/dto/user.dto";

@ObjectType()
export class FollowersResponse{

    @Field()
    id:number;

    @Field()
    followerId:string;

    @Field(()=> UserResponse,{nullable:true})
    followerUser:UserResponse;

}

@ObjectType()
export class FollowingResponse{

    @Field()
    id:number;

    @Field()
    followingId:string;

    @Field(()=> UserResponse,{nullable:true})
    followingUser:UserResponse;

}
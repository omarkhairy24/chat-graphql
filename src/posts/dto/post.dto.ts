import { Field, ObjectType } from "@nestjs/graphql";
import { Comments } from "src/comments/dto/comment.dto";
import { UserResponse } from "src/users/dto/user.dto";

@ObjectType()
export class Post{
    @Field()
    id:number;
    
    @Field()
    userId:string;
    
    @Field(()=>String)
    content:string;
    
    @Field(() => [String])
    images: string[];

    @Field(()=>Number)
    likes:number;

    @Field()
    isLiked:boolean;

    @Field(()=>[Comments])
    comments:Comments[];

    @Field()
    createdAt:Date;
    
    @Field({nullable:true})
    user:UserResponse;
}
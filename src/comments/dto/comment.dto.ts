import { Field, ObjectType } from "@nestjs/graphql";
import { CommentsEntity } from "src/comments/comments.entity";
import { UserResponse } from "src/users/dto/user.dto";

@ObjectType()
export class Comments{
    @Field()
    id:string;
    
    @Field()
    userId:string;

    @Field()
    postId:string;
    
    @Field(()=>String)
    content:string;

    @Field({nullable:true})
    user:UserResponse;

    @Field()
    createdAt:Date;
    
}
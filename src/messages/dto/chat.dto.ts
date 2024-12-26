import { Field, InputType, ObjectType } from "@nestjs/graphql";
import { IsNotEmpty } from "class-validator";
import { UserResponse } from "src/users/dto/user.dto";

@ObjectType()
export class Message {

    @Field()
    id:string;

    @Field()
    senderId:string;

    @Field(()=>String)
    content:string;

    @Field(() => [String])
    images: string[];

    @Field({nullable:true})
    sender:UserResponse;
}

@ObjectType()
export class Chat {

    @Field()
    id:string;

    @Field()
    userId:string;

    @Field()
    friendId:string;

    @Field(() => [Message],{nullable:true})
    messages:Message[]

    @Field({nullable:true})
    user:UserResponse

    @Field({nullable:true})
    friend:UserResponse
}

@ObjectType()
class Info {
    
    @Field()
    id:number;

    @Field()
    user_id:string;

    @Field()
    name:string;

    @Field()
    username:string;

    @Field({nullable:true})
    image:string;

}

@ObjectType()
export class SingleChat {

    @Field(()=>Info)
    ChatInfo:Info;

    @Field(() => [Message],{nullable:true})
    messages:Message[]
}
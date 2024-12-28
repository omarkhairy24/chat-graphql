import { Field, ObjectType } from "@nestjs/graphql";
import { Role } from "../group.users.entity";
import { UserResponse } from "src/users/dto/user.dto";


@ObjectType()
export class GroupMembers {
    @Field()
    id:number;

    @Field()
    groupId:number;

    @Field()
    userId:string;

    @Field()
    role:Role

    @Field()
    user:UserResponse;
}

@ObjectType()
export class Group{
    @Field()
    id:number;

    @Field()
    name:string;

    @Field()
    image:string;

    @Field()
    groupMembers:GroupMembers;
}


import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";

@InputType()
export class UserInfoInput {

    @Field({nullable:true})
    @IsOptional()
    name:string;

    @Field({nullable:true})
    @IsOptional()
    username:string;

    @Field({nullable:true})
    @IsOptional()
    bio:string;

}
import { Field, InputType } from "@nestjs/graphql";
import { IsOptional } from "class-validator";
import { Upload } from "graphql-upload-ts";

@InputType()
export class UserInfoInput {

    @Field({nullable:true})
    @IsOptional()
    name:string;

    @Field({nullable:true})
    @IsOptional()
    username:string;

}
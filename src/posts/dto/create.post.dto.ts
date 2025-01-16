import { Field, InputType } from "@nestjs/graphql";
import { IsOptional, IsString } from "class-validator";

@InputType()
export class postInput {

    @IsString()
    @Field({nullable:true})
    @IsOptional()
    content:string;
    
    @IsOptional()
    images:string[];
}
import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsNotEmpty } from "class-validator";

@InputType()
export class UpdatePasswordInput {

    @Field()
    @IsNotEmpty()
    oldPassword:string;

    @Field()
    @IsNotEmpty()
    newPassword:string;
}
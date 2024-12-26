import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
import { User } from "./user.entity";
import { AuthService } from "./auth.service";
import { RegisterInput } from "./dto/register.dto";
import { VerifyInput } from "./dto/verify.dto";
import { LoginResponse, UserResponse } from "./dto/user.dto";
import { LoginInput } from "./dto/login.dto";
import { UpdatePasswordInput } from "./dto/update-passowrd.dto";
import { UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "./guard/GqlAuthGuard";
import { UsersService } from "./users.service";
import { UserInfoInput } from "./dto/user-info.dto";
import { FileUpload, GraphQLUpload } from "graphql-upload-ts";
import { DataLoaderService } from "src/loader.service";

@Resolver(()=>User)
export class AuthResolver {
    constructor (
        private authService: AuthService,
        private userService: UsersService
    ){}

    @Query(()=> [UserResponse],{name:'search_users'})
    async search(@Args('query') query:string){
        return this.userService.searchUser(query);
    }

    @Query(()=> UserResponse,{name:'Me'})
    @UseGuards(JwtAuthGuard)
    async Me(@Context('req') req:any){
        return this.userService.getMe(req.user.id);
    }

    @Mutation(()=>String ,{name:'register'})
    async register(@Args('input',{type :()=>RegisterInput}) input:RegisterInput){
        return this.authService.register(input);
    }

    @Mutation(()=>String ,{name:'verify'})
    async verify(@Args('input',{type :()=>VerifyInput}) input:VerifyInput){
        return this.authService.verifyUser(input);
    }

    @Mutation(()=> LoginResponse ,{name:'login'})
    async login(@Args('input',{type:()=>LoginInput}) input:LoginInput){
        return this.authService.login(input)
    }

    @Mutation(()=> UserResponse,{name:'update_password'})
    @UseGuards(JwtAuthGuard)
    async updatePassword(
        @Args('input',{type:()=>UpdatePasswordInput}) input:UpdatePasswordInput,
        @Context('req') req:any
    ){
        return this.authService.updatePassword(req.user.id, input)
    }

    @Mutation(()=> UserResponse,{name:'updateInfo'})
    @UseGuards(JwtAuthGuard)
    async updateUserInfo(
        @Args('input' ,{type:()=>UserInfoInput, nullable:true }) input:UserInfoInput,
        @Args({name:'file' , type:()=> GraphQLUpload , nullable:true}) file:FileUpload,
        @Context('req') req:any
    ){    
        return this.userService.updateUserInfo(req.user.id,file,input)
    }
}
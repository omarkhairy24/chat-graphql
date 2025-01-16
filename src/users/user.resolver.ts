import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver } from "@nestjs/graphql";
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
import { FollowService } from "src/follow/follow.service";
import { FollowersResponse, FollowingResponse } from "src/follow/dto/follow.dto";
import { PostsService } from "src/posts/posts.service";

@Resolver(()=>UserResponse)
export class AuthResolver {
    constructor (
        private authService: AuthService,
        private userService: UsersService,
        private followService: FollowService,
        private postsService:PostsService
    ){}
    @Query(()=> [UserResponse],{name:'search_users'})
    async search(@Args('query') query:string){
        return this.userService.searchUser(query);
    }

    @Query(()=>UserResponse,{name:'user'})
    async user(
        @Args('userId') userId:string
    ){
        return this.userService.getUser(userId)
    }

    @ResolveField('postCount',()=>Number)
    async postCount(
        @Parent() user:UserResponse
    ){
        return this.postsService.PostsCount(user.id);
    }

    @ResolveField('followerCount',()=>Number)
    async followerCount(
        @Parent() user:UserResponse
    ){
        return this.followService.followerCount(user.id);
    }

    @ResolveField('followingCount',()=>Number)
    async followingCount(
        @Parent() user:UserResponse
    ){
        return this.followService.followingCount(user.id);
    }

    @ResolveField('followers',()=>[FollowersResponse])
    async followers(
        @Parent() user:UserResponse
    ){
        return await this.followService.followersLoader.load(user.id);
    }

    @ResolveField('following',()=>[FollowingResponse])
    async following(
        @Parent() user:UserResponse
    ){
        return await this.followService.followingLoader.load(user.id)
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
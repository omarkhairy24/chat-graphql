import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.entity';
import { Op } from 'sequelize';
import { UserInfoInput } from './dto/user-info.dto';
import * as fs from 'fs';
import { UploadService } from "src/upload.service";

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User) private repo: typeof User,
        private uploadService: UploadService
    ){}

    async findAll(userIds: string[]): Promise<User[]> {
        return await this.repo.findAll({
            where: {
                id: userIds,
            },
        });
    }

    async searchUser(query:string){
        const result = await this.repo.findAll({
            where:{
                [Op.or]:[
                    { name: {[Op.like]:`%${query}%`} },
                    { username: {[Op.like]: `%${query}%`} }
                ]
            }
        });

        return result
    }

    async updateUserInfo(userId:string,file,input:UserInfoInput){
        const user = await this.repo.findByPk(userId);
        if(!user) throw new NotFoundException('user not found');

        user.set(input || {});
        if(file){
            if(user.image){
                fs.unlinkSync(`uploads/${user.image}`)
            }
            const image = await this.uploadService.uploadFile(file)
            user.image = image
        }
        
        await user.save()
        return user;
    }

    async getMe(userId:string){
        const user = await this.repo.findByPk(userId);
        return user;
    }
}

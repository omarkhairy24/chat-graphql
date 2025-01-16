import { BadRequestException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Group } from './group.entity';
import { GroupUsers, Role } from './group.users.entity';
import { Sequelize } from 'sequelize-typescript';
import * as DataLoader from 'dataloader';


@Injectable()
export class GroupService {
    constructor(
        @InjectModel(Group) private group:typeof Group,
        @InjectModel(GroupUsers) private gUsers:typeof GroupUsers,
        private sequelize: Sequelize
    ){}

    async findGroup(gropId:number){
        return await this.group.findByPk(gropId)
    }

    async findUser(groupId:number,senderId:string){
        return await this.gUsers.findOne({
            where:{
                groupId,
                userId:senderId
            }
        });
    }


    async findMembresByIds(ids:number[]){
        return await this.gUsers.findAll({
            where:{
                groupId:ids
            }
        })
    }

    public groupMemberLoader = new DataLoader(async (groupIds:number[])=>{
            const groupMembers = await this.findMembresByIds(groupIds);
            const memberMap = new Map();
            groupMembers.forEach(member=>{
                if(!memberMap.has(member.groupId)){
                    memberMap.set(member.groupId, [])
                }
                memberMap.get(member.groupId).push(member)
            })
            
            return groupIds.map((id)=> memberMap.get(id)||[]);
        })

    async getGroup(groupId:number,userId:string){
        const member = await this.gUsers.findOne({
            where:{
                userId
            }
        });
        if(!member) throw new BadRequestException('Not Allowed.');

        return await this.group.findByPk(groupId);
    }

    async getGroups(userId:string){
        const groups = await this.sequelize.query(`
                SELECT groups.id,groups.name,groups.image
                FROM groupUsers
                JOIN groups ON groupUsers.groupId = groups.id
                WHERE groupUsers.userId = ?
            `,{
                replacements:[userId]
        });
        

        return groups[0]
    }

    async creataGroup(userId:string,name:string,image:string){
        const group = await this.group.create({
            name,
            image
        });

        await this.gUsers.create({
            groupId:group.id,
            userId:userId,
            role:'admin'
        });

        return group;
    };

    async addMemberSearch(groupId:number, query:string){
        const results = await this.sequelize.query(`
                SELECT id,name,username,image
                FROM users
                WHERE (username LIKE ? OR name LIKE ?)
                AND id NOT IN(
                    SELECT userId
                    FROM GroupUsers
                    WHERE id = ?
                )
            `,{
                replacements:[`${query}%`,`${query}%`,groupId]
        });
        

        return results[0];
    }

    async addGroupMembers(memberId:string,groupId:number,userId:string){
        const group = await this.group.findByPk(groupId);
        if(!group) throw new NotFoundException('group not found.');

        const user = await this.gUsers.findOne({
            where:{
                userId:memberId
            }
        });
        if(!user) throw new NotAcceptableException('you are not member of the group.');

        const isMember = await this.gUsers.findOne({
            where:{
                userId
            }
        });
        if(isMember) throw new BadRequestException('The user is already a member of this group.');

        const groupUser = await this.gUsers.create({
            groupId:group.id,
            userId:userId,
            role:'member'
        });
        

        return groupUser
    }


    async addAdmin(adminId:string,groupId:number,memberId:string){
        const group = await this.group.findByPk(groupId);
        if(!group) throw new NotFoundException('group not found.');

        const user = await this.gUsers.findOne({
            where:{
                groupId,
                userId:adminId
            }
        });

        if(user.role !== 'admin') throw new NotAcceptableException('not allowed.');

        const member = await this.gUsers.findOne({where:{
            userId:memberId,
            groupId
        }});
        if(!member) throw new NotFoundException('member not found');
        if(member.role === Role.admin) throw new BadRequestException('this user already an admin.')
        
        member.role = Role.admin;
        member.save();

        return member;
    }


    async removeMember(adminId:string,groupId:number,memberId:string){
        const group = await this.group.findByPk(groupId);
        if(!group) throw new NotFoundException('group not found.');

        const user = await this.gUsers.findOne({
            where:{
                groupId,
                userId:adminId
            }
        });

        if(user.role !== 'admin') throw new NotAcceptableException('not allowed.');

        const member = await this.gUsers.findOne({where:{
            userId:memberId,
            groupId
        }});
        if(!member) throw new NotFoundException('member not found');

        await member.destroy();

        return group;

    }

}

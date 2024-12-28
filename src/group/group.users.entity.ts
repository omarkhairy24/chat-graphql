import { Field, ObjectType, registerEnumType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/user.entity";
import { Group } from "./group.entity";

export enum Role {
    member = 'member',
    admin = 'admin'
}

registerEnumType(Role ,{name:'Role'})

@Table
@ObjectType()
export class GroupUsers extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @ForeignKey(()=>Group)
    @Column({allowNull:false})
    @Field({nullable:false})
    groupId:number;

    @BelongsTo(()=>Group)
    group:Group


    @ForeignKey(()=>User)
    @Column({allowNull:false})
    @Field({nullable:false})
    userId:string;

    @BelongsTo(()=>User)
    user:User
    

    @Column
    @Field(()=> Role)
    role:Role;

}
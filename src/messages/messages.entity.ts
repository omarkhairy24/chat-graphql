import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { ChatRoom } from "src/friends/chat.entity";
import { Group } from "src/group/group.entity";
import { User } from "src/users/user.entity";

@Table
@ObjectType()
export class Messages extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:number;

    @ForeignKey(()=>ChatRoom)
    @Column
    chatId:number;

    @BelongsTo(()=>ChatRoom)
    chat:ChatRoom

    @ForeignKey(()=>Group)
    @Column
    groupId:number;

    @BelongsTo(()=>Group)
    group:Group

    @ForeignKey(()=>User)
    @Column({allowNull:false})
    @Field({nullable:false})
    senderId:string;

    @BelongsTo(()=>User)
    sender:User

    @Column
    @Field({ nullable: true })
    content:string;

    @Column({type:DataType.JSON})
    @Field(() => [String], { nullable: true })
    images:string[];
}
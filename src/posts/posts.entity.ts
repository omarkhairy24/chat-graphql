import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { User } from "src/users/user.entity";

@Table
@ObjectType()
export class PostsEntity extends Model{

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id:number;

    @ForeignKey(()=>User)
    @Column({allowNull:false})
    @Field({nullable:false})
    userId:string;

    @BelongsTo(()=>User)
    user:User;

    @Column
    @Field({nullable:true})
    content:string;

    @Column({type:DataType.JSON})
    @Field(() => [String], { nullable: true })
    images:string[]
}
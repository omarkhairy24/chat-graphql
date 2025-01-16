import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, BelongsTo, Column, DataType, ForeignKey, Model, PrimaryKey, Table } from "sequelize-typescript";
import { PostsEntity } from "src/posts/posts.entity";
import { User } from "src/users/user.entity";

@Table
@ObjectType()
export class LikeEntity extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @ForeignKey(()=>User)
    @Column({allowNull:false})
    @Field({nullable:false})
    userId:string;

    @BelongsTo(()=>User)
    user:User;

    @ForeignKey(()=>PostsEntity)
    @Column({allowNull:false})
    @Field({nullable:false})
    postId:string;

    @BelongsTo(()=>PostsEntity)
    post:PostsEntity;
}
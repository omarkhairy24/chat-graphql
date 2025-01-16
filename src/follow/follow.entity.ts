import {Column,Table,DataType, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Field,ObjectType} from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@Table
@ObjectType()
export class FollowEntity extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @ForeignKey(() => User)
    @Column
    @Field()
    followerId: string;

    @BelongsTo(() => User)
    follower: User;

    @ForeignKey(() => User)
    @Column
    @Field()
    followingId: string;

    @BelongsTo(() => User)
    following: User;

}
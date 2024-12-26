import {Column,Table,DataType, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Field,ObjectType} from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@Table
@ObjectType()
export class ChatRoom extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @ForeignKey(() => User)
    @Column
    @Field()
    userId: string;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => User)
    @Column
    @Field()
    friendId: string;

    @BelongsTo(() => User)
    friend: User;

}
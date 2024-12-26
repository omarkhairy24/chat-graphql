import {Column,Table,DataType, Model, AutoIncrement, PrimaryKey, ForeignKey, BelongsTo} from 'sequelize-typescript'
import {Field,ObjectType} from '@nestjs/graphql';
import { User } from 'src/users/user.entity';

@Table
@ObjectType()
export class FriendRequests extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    @Field()
    senderId: string;

    @BelongsTo(() => User)
    sender: User;

    @ForeignKey(() => User)
    @Column(DataType.UUID)
    @Field()
    receiverId: string;

    @BelongsTo(() => User)
    receiver: User;


}
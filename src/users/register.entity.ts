import {Field,ObjectType} from '@nestjs/graphql';
import {Column, DataType, Model, Table, Unique } from "sequelize-typescript";

@Table
@ObjectType()
export class Register extends Model{
    @Column({
        primaryKey: true,
        defaultValue: DataType.UUIDV4,
        type: DataType.UUID,
    })
    @Field()
    id: string;

    @Unique
    @Column({allowNull:false})
    @Field({nullable:false})
    username:string;

    @Column({allowNull:false})
    @Field({nullable:false})
    name:string;

    @Unique
    @Column({ allowNull:false })
    @Field({nullable:false})
    email: string;

    @Column({ allowNull:false})
    @Field({nullable:false})
    password: string;

    @Column
    otp:string;

    @Column
    otpExpiresAt: Date;

    @Column
    attempts: number;
}
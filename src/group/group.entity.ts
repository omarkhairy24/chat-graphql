import { Field, ObjectType } from "@nestjs/graphql";
import { AutoIncrement, Column, DataType, Model, PrimaryKey, Table } from "sequelize-typescript";

@Table
@ObjectType()
export class Group extends Model {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.BIGINT)
    @Field()
    id?: number;

    @Column
    @Field()
    name:string;

    @Column
    @Field()
    image:string;

}
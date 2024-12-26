import { Field, ObjectType } from "@nestjs/graphql";
import { BeforeSave, Column, DataType, Model, Table, Unique } from "sequelize-typescript";

@Table
@ObjectType()
export class User extends Model{
    @Column({
        primaryKey:true,
        defaultValue:DataType.UUIDV4,
        type:DataType.UUID
    })
    @Field()
    id:string;

    @Unique
    @Column
    @Field({nullable:false})
    username:string;

    @Column
    @Field({nullable:false})
    name:string;

    @Unique
    @Column({ allowNull:false })
    @Field({nullable:false})
    email: string;

    @Column({ allowNull:false })
    @Field({nullable:false})
    password: string;
    
    @Column({ allowNull: true })
    @Field({nullable:true})
    image: string;

    @Column
    passwordChangedAt:Date;

    @BeforeSave
    static async setPasswordChangedAt(user:User){
        if(!user.isNewRecord && user.changed('password')){
            user.setDataValue('passwordChangedAt',Date.now() - 1000);
        }
    }
}
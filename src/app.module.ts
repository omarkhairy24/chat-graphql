import { MiddlewareConsumer, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
import { MailModule } from './mail/mail.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { graphqlUploadExpress } from 'graphql-upload-ts';
import { MessagesModule } from './messages/messages.module';
import { Dialect } from 'sequelize';
import { GroupModule } from './group/group.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { LikesModule } from './likes/likes.module';
import { FollowModule } from './follow/follow.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal:true,
      envFilePath:`.env`
    }),
     GraphQLModule.forRoot<ApolloDriverConfig>({
      driver:ApolloDriver,
      path:'/graphql',
      autoSchemaFile:join(process.cwd(),'src/schema.gql'),
      context:(({req})=> req),
      subscriptions:{
        'graphql-ws':true
      }
     }),
    //  SequelizeModule.forRootAsync({
    //   inject:[ConfigService],
    //   useFactory:(config:ConfigService)=>{
    //     return {
    //       dialect:config.get<string>('DB_TYPE') as Dialect,
    //       host: config.get<string>('host'),
    //       port: config.get<number>('port'),
    //       username:config.get<string>('username') ,
    //       password: config.get<string>('password'),
    //       autoLoadModels:true,
    //       storage:config.get<string>('DB_NAME'),
    //       database:config.get<string>('DB_NAME'),
    //       synchronize:true
    //     }
    //   }
    // }),
    SequelizeModule.forRoot({
      dialect:'sqlite',
      storage:'db.sqlite',
      synchronize:true,
      autoLoadModels:true
    }),
    UsersModule, 
    MailModule,
    MessagesModule,
    GroupModule,
    PostsModule,
    CommentsModule,
    LikesModule,
    FollowModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer){
    consumer.apply(graphqlUploadExpress({maxFieldSize:10000000 ,maxFiles:5}))
    .forRoutes('/graphql')
  }
}

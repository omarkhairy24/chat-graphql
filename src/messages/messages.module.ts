import { Module } from '@nestjs/common';
import { MessagesService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from './messages.entity';
import { FriendsModule } from 'src/friends/friends.module';
import { Chatesolver } from './chat.resolver';
import { UploadService } from 'src/upload.service';
import { DataLoaderService } from 'src/loader.service';
import { UsersModule } from 'src/users/users.module';
import { MessageResolver } from './message.resolver';
import { GroupModule } from 'src/group/group.module';

@Module({
  imports:[
    SequelizeModule.forFeature([Messages]),
    GroupModule,
    FriendsModule,
    UsersModule
  ],
  providers: [Chatesolver,MessageResolver,MessagesService,UploadService,DataLoaderService],
  exports:[MessagesService]
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { MessagesService } from './chat.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Messages } from './messages.entity';
import { Chatesolver } from './chat.resolver';
import { UploadService } from 'src/upload.service';
import { UsersModule } from 'src/users/users.module';
import { MessageResolver } from './message.resolver';
import { GroupModule } from 'src/group/group.module';
import { ChatRoom } from './chat.entity';

@Module({
  imports:[
    SequelizeModule.forFeature([ChatRoom,Messages]),
    GroupModule,
    UsersModule
  ],
  providers: [Chatesolver,MessageResolver,MessagesService,UploadService],
  exports:[MessagesService]
})
export class MessagesModule {}

import { Module } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { UsersModule } from 'src/users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { FriendRequests } from './friendRequest.entity';
import { ChatRoom } from './chat.entity';
import { FriendReqResolver } from './friends.resolver';
import { DataLoaderService } from 'src/loader.service';
import { UsersService } from 'src/users/users.service';

@Module({
  imports:[
    SequelizeModule.forFeature([FriendRequests,ChatRoom]),
    UsersModule
  ],
  providers: [FriendReqResolver,FriendsService,DataLoaderService],
  exports:[FriendsService]
})
export class FriendsModule {}

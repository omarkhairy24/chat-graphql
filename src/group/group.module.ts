import { forwardRef, Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Group } from './group.entity';
import { GroupUsers } from './group.users.entity';
import { UsersModule } from 'src/users/users.module';
import { UploadService } from 'src/upload.service';
import { GroupResolver } from './group.resovler';
import { DataLoaderService } from 'src/loader.service';
import { FriendsModule } from 'src/friends/friends.module';
import { GroupMemberResolver } from './groupMember.resolver';

@Module({
  imports:[
    SequelizeModule.forFeature([Group,GroupUsers]),
    UsersModule,
    forwardRef(()=> FriendsModule)
  ],
  providers: [GroupMemberResolver,GroupResolver,GroupService,UploadService,DataLoaderService],
  exports:[GroupService]
})
export class GroupModule {}

import { forwardRef, Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { FollowEntity } from './follow.entity';
import { FollowResolver } from './follow.resolver';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[
    SequelizeModule.forFeature([FollowEntity]),
    forwardRef(()=>UsersModule),
  ],
  providers: [FollowResolver,FollowService],
  exports:[FollowService]
})
export class FollowModule {}

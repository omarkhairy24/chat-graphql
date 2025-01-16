import { forwardRef, Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { CommentsEntity } from './comments.entity';
import { PostsModule } from 'src/posts/posts.module';
import { CommentsResolver } from './comments.resolver';
import { UsersModule } from 'src/users/users.module';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports:[
    SequelizeModule.forFeature([CommentsEntity]),
    forwardRef(()=>UsersModule),
    forwardRef(() => PostsModule),
    FollowModule
  ],
  providers: [CommentsResolver,CommentsService],
  exports:[CommentsService]
})
export class CommentsModule {}

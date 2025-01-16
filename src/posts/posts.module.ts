import { forwardRef, Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { PostsEntity } from './posts.entity';
import { PostResolver } from './posts.resolver';
import { UploadService } from 'src/upload.service';
import { LikesModule } from 'src/likes/likes.module';
import { CommentsModule } from 'src/comments/comments.module';
import { UsersModule } from 'src/users/users.module';
import { FollowModule } from 'src/follow/follow.module';

@Module({
  imports:[
    SequelizeModule.forFeature([PostsEntity]),
    forwardRef(()=>UsersModule),
    CommentsModule,
    LikesModule,
    FollowModule
  ],
  providers: [PostResolver,PostsService,UploadService],
  exports:[PostsService]
})
export class PostsModule {}

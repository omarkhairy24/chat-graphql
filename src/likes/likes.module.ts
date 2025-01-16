import { Module } from '@nestjs/common';
import { LikesService } from './likes.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { LikeEntity } from './likes.entity';
import { LikeResolver } from './likes.resolver';

@Module({
  imports:[
    SequelizeModule.forFeature([LikeEntity])
  ],
  providers: [LikeResolver,LikesService],
  exports:[LikesService]
})
export class LikesModule {}

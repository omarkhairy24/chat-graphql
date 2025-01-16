import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthService } from './auth.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { Register } from './register.entity';
import { User } from './user.entity';
import { MailService } from 'src/mail/mail.service';
import { AuthResolver } from './user.resolver';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './guard/auth.guard';
import { UploadService } from 'src/upload.service';
import { FollowModule } from 'src/follow/follow.module';
import { PostsModule } from 'src/posts/posts.module';

@Module({
  imports:[
    SequelizeModule.forFeature([Register,User]),
    JwtModule.registerAsync({
      imports: [
        ConfigModule,
      ],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwtSecret'),
        signOptions: { expiresIn: '90d' },
      }),
    }),
    PostsModule,
    FollowModule,
  ],
  providers: [
    JwtStrategy,
    JwtService,
    AuthResolver,
    AuthService,
    UsersService,
    MailService,
    UploadService,
    
  ],
  exports:[JwtStrategy,JwtModule,UsersService]
})
export class UsersModule {}

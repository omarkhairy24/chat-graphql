import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Register } from './register.entity';
import { RegisterInput } from './dto/register.dto';
import { User } from './user.entity';
import { MailService } from 'src/mail/mail.service';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';
import { VerifyInput } from './dto/verify.dto';
import { LoginInput } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordInput } from './dto/update-passowrd.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(Register) private registerRepo:typeof Register,
        @InjectModel(User) private userRepo :typeof User,
        private mailService: MailService,
        private jwtService: JwtService,
        private configService: ConfigService
    ){}

    async register(input:RegisterInput){

        const [checkRegisterEmail,checkEmail] = await Promise.all([
            this.registerRepo.findOne({where:{email:input.email}}),
            this.userRepo.findOne({where:{email:input.email}})
        ])

        if(checkRegisterEmail){
            await this.registerRepo.destroy({where:{email:input.email}})
        }

        if(checkEmail) throw new BadRequestException('email already exist.');

        const [checkRegisterUsername,checkUsername] = await Promise.all([
            this.registerRepo.findOne({where:{username:input.username}}),
            this.userRepo.findOne({where:{username:input.username}})
        ]);

        if(checkRegisterUsername || checkUsername) throw new BadRequestException('username already exist.');


        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(input.password,salt);
        const otp = randomInt(100000, 999999).toString();
        const otpExpiresAt = Date.now() + 5 * 60 * 1000
        try {
            
            this.mailService.sendVerificationEmail(input.email,'verification code from chat app',
                `expires after 5 min \n otp: ${otp}
            `);

            const user = await this.registerRepo.create({
                username:input.username,
                name:input.name,
                email:input.email,
                password:hashedPassword,
                otp:otp,
                otpExpiresAt:otpExpiresAt,
                attempts:3
            })
            
            
        } catch (error) {
            console.log(error);
            throw new Error('something went wrong')
        }

        return 'verification code sent to your email'

    }

    async verifyUser(input:VerifyInput){
        const user = await this.registerRepo.findOne({where:{email:input.email}});
        if(!user) throw new NotFoundException('user not found');
        let attempts = user.attempts;
        
        if(user.otp !== input.otp){
            let remainingAttempts = attempts - 1;

            user.attempts = remainingAttempts;
            await user.save();

            if(remainingAttempts === 0){
                await user.destroy()
                throw new BadRequestException('no remaining attempts, try again');
            }

            throw new BadRequestException(`Incorrect OTP. You have ${remainingAttempts} attempts remaining.`)
        }

        if(new Date() > user.otpExpiresAt){
            await user.destroy();
            throw new BadRequestException('otp expired, try again');
        }
    
        await this.userRepo.create({
            username:user.username,
            name:user.name,
            email:user.email,
            password:user.password,
        });

        await user.destroy();

        return 'user created successfully.';
    };

    async login(input:LoginInput){
        const user = await this.userRepo.findOne({where:{email:input.email}});
        if(!user) throw new BadRequestException('incorrect email or password');

        const comparePassowrd = await bcrypt.compare(input.password,user.password);
        if(!comparePassowrd) throw new BadRequestException('incorrect email or password');

        const payload = {sub:user.id};
        const token = this.jwtService.sign(payload,{
            secret:this.configService.get('jwtSecret')
        });
        return {token, user}
    }

    async updatePassword(userId:string,input:UpdatePasswordInput){
        const user = await this.userRepo.findOne({where:{id:userId}});
        if(!user) throw new NotFoundException('user not found');

        const comapreOldPassword = await bcrypt.compare(input.oldPassword,user.password);
        if(!comapreOldPassword) throw new BadRequestException('The passwords you entered do not match. Please try again.');

        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(input.newPassword,salt);

        user.password = hashPassword;
        user.passwordChangedAt = new Date(Date.now() - 1000);
        await user.save();

        return user;
    }
}

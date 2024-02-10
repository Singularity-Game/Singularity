import { Module } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './models/user.entity';
import { AuthenticationService } from './authentication.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UserController } from './user.controller';
import { LocalStrategy } from './strategies/local.strategy';
import { UserProfile } from './automapper-profiles/user.profile';
import { CreatePasswordTokenEntity } from './models/create-password-token.entity';
import { MailModule } from '../mail/mail.module';

@Module({
  providers: [UserManagementService, AuthenticationService, JwtStrategy, LocalStrategy, UserProfile],
  imports: [
    TypeOrmModule.forFeature([User, CreatePasswordTokenEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('AUTHENTICATION_JWT_SECRET'),
        signOptions: { expiresIn: '7d' },
      }),
      inject: [ConfigService],
    }),
    ConfigModule,
    MailModule
  ],
  controllers: [UserController],
})
export class UserManagementModule {}

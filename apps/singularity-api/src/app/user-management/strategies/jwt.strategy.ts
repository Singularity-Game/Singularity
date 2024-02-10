import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { UserManagementService } from '../user-management.service';
import { Nullable } from '@singularity/api-interfaces';
import { User } from '../models/user.entity';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService, private readonly userService: UserManagementService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('AUTHENTICATION_JWT_SECRET')
    });
  }

  public async validate(payload: any): Promise<Nullable<User>> {
    return this.userService.getUserByID(payload.sub);
  }
}

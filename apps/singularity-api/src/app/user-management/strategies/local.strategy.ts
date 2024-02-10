import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthenticationService } from '../authentication.service';
import { Nullable } from '@singularity/api-interfaces';
import { User } from '../models/user.entity';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authenticationService: AuthenticationService) {
    super();
  }

  public async validate(username: string, password: string): Promise<Nullable<User>> {
    const user = await this.authenticationService.validateUser(username, password);
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }

}

import { Injectable } from '@nestjs/common';
import { UserManagementService } from './user-management.service';
import { JwtService } from '@nestjs/jwt';
import { User } from './models/user.entity';
import { Nullable, UserDto } from '@singularity/api-interfaces';
import * as bcrypt from 'bcryptjs';
import { UserMapper } from './mapper/user-mapper.service';

@Injectable()
export class AuthenticationService {
  constructor(
    private readonly userService: UserManagementService,
    private readonly jwtService: JwtService,
    private readonly userMapper: UserMapper
  ) {}

  public async validateUser(username: string, password: string): Promise<Nullable<User>> {
    const user = await this.userService.getUserByUsername(username);
    if (user && user.active && (await AuthenticationService.arePasswordsEqual(user.hashedPassword, password))) {
      return user;
    } else {
      return null;
    }
  }

  public login(user: User): string {
    const userDto = this.userMapper.mapToDto(user);

    const payload = { username: user.username, sub: user.id, user: userDto };
    return this.jwtService.sign(payload);
  }

  private static async arePasswordsEqual(hashedPassword: string, plainPassword: string) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }
}

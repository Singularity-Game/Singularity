import { Injectable } from '@nestjs/common';
import { User } from '../models/user.entity';
import { UserDto } from '@singularity/api-interfaces';

@Injectable()
export class UserMapper {
  public mapToDto(user: User): UserDto {
    const userDto = new UserDto();
    userDto.id = user.id;
    userDto.active = user.active;
    userDto.email = user.email;
    userDto.isAdmin = user.isAdmin;
    userDto.username = user.username;
    userDto.profilePictureBase64 = user.profilePictureBase64;

    return userDto;
  }

  public mapToEntity(userDto: UserDto): User {
    const user = new User();
    user.id = userDto.id;
    user.active = userDto.active;
    user.username = userDto.username;
    user.email = userDto.email;
    user.isAdmin = userDto.isAdmin;
    user.profilePictureBase64 = userDto.profilePictureBase64;

    return user;
  }
}

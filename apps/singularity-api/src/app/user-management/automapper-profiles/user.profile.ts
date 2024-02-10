import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { User } from '../models/user.entity';
import { UserDto } from '@singularity/api-interfaces';

@Injectable()
export class UserProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, User, UserDto, forMember(dest => dest.id, mapFrom(src => src.id)));
      createMap(mapper, UserDto, User, forMember(dest => dest.id, mapFrom(src => src.id)));
    };
  }
}

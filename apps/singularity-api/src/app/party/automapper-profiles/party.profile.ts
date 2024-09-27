import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { Party } from '../models/party';
import { PartyDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Party, PartyDto, forMember(dest => dest.id, mapFrom(src => src.id)));
      createMap(mapper, PartyDto, Party, forMember(dest => dest.id, mapFrom(src => src.id)));
    };
  }
}
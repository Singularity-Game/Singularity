import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { PartyParticipantDto } from '@singularity/api-interfaces';
import { PartyParticipant } from '../models/party-participant';

@Injectable()
export class PartyParticipantProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PartyParticipant, PartyParticipantDto, forMember(dest => dest.id, mapFrom(src => src.id)));
      createMap(mapper, PartyParticipantDto, PartyParticipant, forMember(dest => dest.id, mapFrom(src => src.id)));
    };
  }
}

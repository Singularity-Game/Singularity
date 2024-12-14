import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { PartyQueueItem } from '../models/party-queue-item';
import { PartyParticipantDto, PartyQueueItemDto } from '@singularity/api-interfaces';
import { PartyParticipant } from '../models/party-participant';

@Injectable()
export class PartyQueueItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PartyQueueItem, PartyQueueItemDto,
        forMember(dest => dest.participants, mapFrom(src => mapper.mapArray(src.participants, PartyParticipant, PartyParticipantDto))),
        forMember(dest => dest.id, mapFrom(src => src.id)));
      createMap(mapper, PartyQueueItemDto, PartyQueueItem,
        forMember(dest => dest.participants, mapFrom(src => mapper.mapArray(src.participants, PartyParticipantDto, PartyParticipant))),
        forMember(dest => dest.id, mapFrom(src => src.id)));
    };
  }
}

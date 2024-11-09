import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { PartyQueueItem } from '../models/party-queue-item';
import { PartyQueueItemDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyQueueItemProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, PartyQueueItem, PartyQueueItemDto);
      createMap(mapper, PartyQueueItemDto, PartyQueueItem);
    };
  }
}

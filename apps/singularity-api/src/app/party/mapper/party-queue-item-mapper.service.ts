import { Injectable } from '@nestjs/common';
import { PartyQueueItem } from '../models/party-queue-item';
import { PartyQueueItemDto } from '@singularity/api-interfaces';
import { PartyParticipantMapper } from './party-participant-mapper.service';
import { SongMapper } from '../../song/mapper/song-mapper.service';

@Injectable()
export class PartyQueueItemMapper {
  constructor(private readonly partyParticipantMapper: PartyParticipantMapper,
              private readonly songMapper: SongMapper) {}

  public mapToDto(partyQueueItem: PartyQueueItem): PartyQueueItemDto {
    const partyQueueItemDto = new PartyQueueItemDto();
    partyQueueItemDto.id = partyQueueItem.id;
    partyQueueItemDto.ready = partyQueueItem.ready;
    partyQueueItemDto.participants = partyQueueItem.participants.map(participant => this.partyParticipantMapper.mapToDto(participant));
    partyQueueItemDto.song = this.songMapper.mapToDto(partyQueueItem.song);

    return partyQueueItemDto;
  }
}

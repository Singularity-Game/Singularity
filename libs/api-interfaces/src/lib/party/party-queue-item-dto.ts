import { PartyParticipantDto } from './party-participant-dto';
import { SongOverviewDto } from '../song/song-overview-dto';
import { UUID } from '../shared/uuid';

export class PartyQueueItemDto {
  public id!: UUID;
  public song!: SongOverviewDto;
  public participants!: PartyParticipantDto[];
  public ready!: boolean;

}

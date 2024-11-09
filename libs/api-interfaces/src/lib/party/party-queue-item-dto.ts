import { AutoMap } from '@automapper/classes';
import { PartyParticipantDto } from './party-participant-dto';
import { SongOverviewDto } from '../song/song-overview-dto';
import { UUID } from '../shared/uuid';

export class PartyQueueItemDto {
  @AutoMap()
  public readonly id!: UUID;

  @AutoMap()
  public readonly song!: SongOverviewDto;

  @AutoMap()
  public participants!: PartyParticipantDto[];

  @AutoMap()
  public ready!: boolean;

}

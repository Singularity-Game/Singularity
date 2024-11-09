import { PartyParticipant } from './party-participant';
import { Song } from '../../song/models/song.entity';
import { UUID } from '@singularity/api-interfaces';
import { AutoMap } from '@automapper/classes';

export class PartyQueueItem {
  @AutoMap()
  public readonly id: UUID;

  @AutoMap()
  public readonly song: Song;

  @AutoMap()
  public participants: PartyParticipant[];

  constructor(song: Song, participants: PartyParticipant[]) {
    this.id = crypto.randomUUID();
    this.song = song;
    this.participants = participants;
  }

  @AutoMap()
  public get ready(): boolean {
    return this.participants.length > 1;
  }
}

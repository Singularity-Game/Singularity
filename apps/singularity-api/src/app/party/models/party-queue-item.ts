import { PartyParticipant } from './party-participant';
import { Song } from '../../song/models/song.entity';
import { UUID } from '@singularity/api-interfaces';

export class PartyQueueItem {
  public readonly id: UUID;
  public readonly song: Song;
  public participants: PartyParticipant[];

  constructor(song: Song, participants: PartyParticipant[]) {
    this.id = crypto.randomUUID();
    this.song = song;
    this.participants = participants;
  }

  public get ready(): boolean {
    return this.participants.length > 1;
  }
}

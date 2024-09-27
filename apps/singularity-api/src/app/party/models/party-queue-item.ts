import { PartyParticipant } from './party-participant';
import { Song } from '../../song/models/song.entity';

export class PartyQueueItem {
  public participants: PartyParticipant[];
  public song: Song;

  public get ready(): boolean {
    return this.participants.length > 1;
  }
}

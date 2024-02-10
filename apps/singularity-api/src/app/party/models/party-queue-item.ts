import { PartyParticipant } from './party-participant';
import { Song } from '../../song/models/song.entity';

export class PartyQueueItem {
  public participants: PartyParticipant[];
  public song: Song;
}

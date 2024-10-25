import { User } from '../../user-management/models/user.entity';
import { AutoMap } from '@automapper/classes';
import { Song } from '../../song/models/song.entity';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { PartyParticipant } from './party-participant';

export class Party {
  @AutoMap()
  public readonly id: string;

  @AutoMap()
  public readonly name: string;

  @AutoMap()
  public readonly creator: User;

  private lastInteraction: Date;
  private currentSongSubject = new ReplaySubject<Song>(1);
  private participantsSubject = new BehaviorSubject<PartyParticipant[]>([]);

  constructor(name: string, user: User) {
    this.id = Math.random().toString(36).slice(2, 7);
    this.lastInteraction = new Date();
    this.name = name;
    this.creator = user;
  }

  public join(participant: PartyParticipant): void {
    const participants = this.participantsSubject.getValue();
    participants.push(participant);
    this.participantsSubject.next(participants);
  }

  public getParticipants$(): Observable<PartyParticipant[]> {
    return this.participantsSubject.asObservable();
  }

  public getParticipantById(participantId: string): PartyParticipant {
    const participants = this.participantsSubject.getValue();
    return participants.find((participant: PartyParticipant) => participant.id === participantId);
  }

  public setCurrentSong(song: Song): void {
    this.currentSongSubject.next(song);
  }

  public getCurrentSong$(): Observable<Song> {
    return this.currentSongSubject.asObservable();
  }
}

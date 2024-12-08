import { User } from '../../user-management/models/user.entity';
import { AutoMap } from '@automapper/classes';
import { Song } from '../../song/models/song.entity';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import { PartyParticipant } from './party-participant';
import { PartyQueueItem } from './party-queue-item';
import { UUID } from '@singularity/api-interfaces';

export class Party {
  @AutoMap()
  public readonly id: string;

  @AutoMap()
  public readonly name: string;

  @AutoMap()
  public readonly creator: User;

  private lastInteraction: Date;
  private participants: PartyParticipant[] = [];

  private currentSongSubject = new ReplaySubject<Song>(1);
  private queueSubject = new BehaviorSubject<PartyQueueItem[]>([])

  constructor(name: string, user: User) {
    this.id = Math.random().toString(36).slice(2, 7);
    this.lastInteraction = new Date();
    this.name = name;
    this.creator = user;
  }

  public join(participant: PartyParticipant): void {
    this.lastInteraction = new Date();

    this.participants.push(participant);
  }

  public getParticipantById(participantId: string): PartyParticipant {
    this.lastInteraction = new Date();

    return this.participants.find((participant: PartyParticipant) => participant.id === participantId);
  }

  public setCurrentSong(song: Song): void {
    this.lastInteraction = new Date();

    this.currentSongSubject.next(song);
  }

  public queueSong(queueItem: PartyQueueItem): void {
    this.lastInteraction = new Date();

    const queue = this.queueSubject.getValue();
    queue.push(queueItem);
    this.queueSubject.next(queue);
  }

  public joinQueuedSong(queueId: UUID, participant: PartyParticipant): PartyQueueItem {
    this.lastInteraction = new Date();

    const queue = this.queueSubject.getValue();
    const queueItem = queue.find((item: PartyQueueItem) => item.id === queueId);

    if(!queueItem) {
      throw Error('There is no QueueItem with the given Id');
    }

    if(queueItem.participants.length >= 2) {
      throw Error('Max Participants for this QueueItem reached');
    }

    queueItem.participants.push(participant);

    // Move Item to the back of the queue when it is ready.
    if (queueItem.participants.length === 2) {
      queue.splice(queue.indexOf(queueItem), 1);
      queue.push(queueItem);
    }

    this.queueSubject.next(queue);

    return queueItem;
  }

  public leaveQueuedSong(queueId: UUID, participant: PartyParticipant): PartyQueueItem {
    this.lastInteraction = new Date();

    const queue = this.queueSubject.getValue();
    const queueItem = queue.find((item: PartyQueueItem) => item.id === queueId);

    if(!queueItem) {
      throw Error('There is no QueueItem with the given Id');
    }

    const index = queueItem.participants.findIndex((queueParticipant: PartyParticipant) => queueParticipant.id === participant.id);

    if(index === -1) {
      throw Error('The given Participant is not a Participant of this queueItem');
    }

    queueItem.participants.splice(index, 1);

    // Remove the queueItem if there are no participants left
    if(queueItem.participants.length === 0) {
      queue.splice(queue.indexOf(queueItem));
    }

    this.queueSubject.next(queue);

    return queueItem;
  }

  public getCurrentSong$(): Observable<Song> {
    this.lastInteraction = new Date();

    return this.currentSongSubject.asObservable();
  }

  public getQueue$(): Observable<PartyQueueItem[]> {
    this.lastInteraction = new Date();

    return this.queueSubject.asObservable();
  }
}

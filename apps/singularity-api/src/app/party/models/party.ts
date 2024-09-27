import { User } from '../../user-management/models/user.entity';
import { UUID } from '@singularity/api-interfaces';
import { PartyParticipant } from './party-participant';
import { AutoMap } from '@automapper/classes';

export class Party {
  @AutoMap()
  public readonly id: string;

  @AutoMap()
  public readonly name: string;

  @AutoMap()
  public readonly creator: User;

  @AutoMap()
  public participants: PartyParticipant[];

  @AutoMap()
  public lastInteraction: Date;

  constructor(name: string, user: User) {
    this.id = Math.random().toString(36).slice(2, 7);
    this.lastInteraction = new Date();
    this.participants = [];
    this.name = name;
    this.creator = user;
  }
}

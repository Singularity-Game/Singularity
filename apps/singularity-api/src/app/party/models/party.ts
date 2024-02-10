import { User } from '../../user-management/models/user.entity';
import { UUID } from '@singularity/api-interfaces';
import { PartyParticipant } from './party-participant';

export class Party {
  public readonly id: UUID;
  public readonly name: string;
  public readonly creator: User;
  public participants: PartyParticipant[];
  public lastInteraction: Date;

  constructor(name: string, user: User) {
    this.id = crypto.randomUUID();
    this.lastInteraction = new Date();
    this.participants = [];
    this.name = name;
    this.creator = user;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { Party } from './models/party';
import { Nullable, UUID } from '@singularity/api-interfaces';
import { User } from '../user-management/models/user.entity';
import { BehaviorSubject } from 'rxjs';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class PartyService {

  private partiesSubject = new BehaviorSubject<Party[]>([]);
  private readonly logger = new Logger(PartyService.name);

  public createParty(party: Party): Party {
    const parties = this.partiesSubject.getValue();
    parties.push(party);
    this.partiesSubject.next(parties);

    return party;
  }

  public endParty(id: UUID): Nullable<Party> {
    const parties = this.partiesSubject.getValue();
    const index = parties.findIndex(party => party.id === id);

    if(index === -1) {
      return null;
    }

    const party = parties[index];
    parties.splice(index, 1);

    this.partiesSubject.next(parties);

    return party;
  }

  public getPartyByUser(user: User): Nullable<Party> {
    return this.partiesSubject.getValue().find((party: Party) => party.creator.id === user.id) ?? null;
  }

  public getPartyById(id: string): Nullable<Party> {
    return this.partiesSubject.getValue().find((party: Party) => party.id === id) ?? null;
  }

  @Cron('0 */4 * * *')
  public cleanupParties() {
    const parties = this.partiesSubject.getValue();
    const fourHoursAgo = new Date(new Date().getTime() - 4 * 60 * 60 * 1000);
    const partiesToClean = parties.filter((party: Party) => party.getLastInteraction() < fourHoursAgo);
    partiesToClean.forEach((party: Party) => {
      this.endParty(party.id);
    });

    this.logger.log(`Ended ${partiesToClean.length} Parties`)
  }
}

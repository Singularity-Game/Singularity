import { Injectable } from '@nestjs/common';
import { Party } from './models/party';
import { Nullable, UUID } from '@singularity/api-interfaces';
import { User } from '../user-management/models/user.entity';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class PartyService {

  private partiesSubject = new BehaviorSubject<Party[]>([]);

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
}

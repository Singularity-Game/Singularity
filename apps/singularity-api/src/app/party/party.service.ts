import { Injectable } from '@nestjs/common';
import { Party } from './models/party';
import { Nullable, UUID } from '@singularity/api-interfaces';
import { User } from '../user-management/models/user.entity';

@Injectable()
export class PartyService {

  private parties: Party[] = [];

  constructor() {
  }

  public createParty(party: Party): Party {
    this.parties.push(party);
    return party;
  }

  public endParty(id: UUID): Nullable<Party> {
    const index = this.parties.findIndex(party => party.id === id);

    if(index === -1) {
      return null;
    }

    const party = this.parties[index];
    this.parties.splice(index, 1);
    return party;
  }

  public getPartyByUser(user: User): Nullable<Party> {
    return this.parties.find((party: Party) => party.creator.id === user.id) ?? null;
  }

}

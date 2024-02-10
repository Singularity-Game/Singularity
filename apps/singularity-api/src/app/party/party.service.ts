import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { Nullable, UUID } from '@singularity/api-interfaces';

@Injectable()
export class PartyService {

  private parties: Party[] = [];

  constructor(private readonly configService: ConfigService) {
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

}

import { Injectable } from '@nestjs/common';
import { Party } from '../models/party';
import { Nullable, PartyDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyMapper {
  public mapToDto(party: Nullable<Party>): Nullable<PartyDto> {
    if (!party) {
      return null;
    }

    const partyDto = new PartyDto();
    partyDto.id = party.id;
    partyDto.name = party.name;
    partyDto.creator = party.creator.username;

    return partyDto;
  }
}

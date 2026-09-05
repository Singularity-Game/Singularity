import { Injectable } from '@nestjs/common';
import { Party } from '../models/party';
import { PartyDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyMapper {
  public mapToDto(party: Party): PartyDto {
    const partyDto = new PartyDto();
    partyDto.id = party.id;
    partyDto.name = party.name;
    partyDto.creator = party.creator.username;

    return partyDto;
  }
}

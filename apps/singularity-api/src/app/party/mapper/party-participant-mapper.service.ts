import { Injectable } from '@nestjs/common';
import { PartyParticipantDto } from '@singularity/api-interfaces';
import { PartyParticipant } from '../models/party-participant';

@Injectable()
export class PartyParticipantMapper {
  public mapToDto(partyParticipant: PartyParticipant): PartyParticipantDto {
    const partyParticipantDto = new PartyParticipantDto();
    partyParticipantDto.id = partyParticipant.id;
    partyParticipantDto.name = partyParticipant.name;
    partyParticipantDto.pictureBase64 = partyParticipant.pictureBase64;
    partyParticipantDto.totalPlays = partyParticipant.totalPlays;
    partyParticipantDto.totalPoints = partyParticipant.totalPoints;

    return partyParticipantDto;
  }
}

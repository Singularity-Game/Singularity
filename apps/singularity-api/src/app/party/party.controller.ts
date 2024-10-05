import { Body, Controller, Get, Param, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreatePartyDto, PartyDto } from '@singularity/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { PartyService } from './party.service';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { MapInterceptor } from '@automapper/nestjs';
import { PartyParticipant } from './models/party-participant';
import { JoinPartyDto } from '@singularity/api-interfaces';

@Controller('party')
export class PartyController {

  constructor(private readonly partyService: PartyService) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(Party, PartyDto))
  public createParty(@Req() request: Request, @Body() createPartyDto: CreatePartyDto): Party {
    const party = new Party(createPartyDto.name, request.user as User);

    const createdParty = this.partyService.createParty(party);
    console.log(createdParty);

    return createdParty;
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(Party, PartyDto))
  public getMyParty(@Req() request: Request): Party {
    return this.partyService.getPartyByUser(request.user as User);
  }

  @Get(':id')
  @UseInterceptors(MapInterceptor(Party, PartyDto))
  public getPartyById(@Param('id') id: string): Party {
    return this.partyService.getPartyById(id);
  }

  @Get(':partyId/participant/:participantId')
  public getPartyParticipant(@Param('partyId') partyId: string, @Param('participantId') participantId: string): PartyParticipant {
    return this.partyService.getPartyParticipant(partyId, participantId);
  }

  @Post(':partyId/join')
  public joinParty(@Param('partyId') partyId: string, @Body() joinPartyDto: JoinPartyDto): PartyParticipant {
    const participant = new PartyParticipant(joinPartyDto.name, joinPartyDto.profilePictureBase64);
    this.partyService.joinParty(partyId, participant);

    console.log(joinPartyDto);
    console.log(participant);

    return participant;
  }
}

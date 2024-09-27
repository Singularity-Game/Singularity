import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreatePartyDto, PartyDto } from '@singularity/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { PartyService } from './party.service';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { MapInterceptor } from '@automapper/nestjs';

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
}

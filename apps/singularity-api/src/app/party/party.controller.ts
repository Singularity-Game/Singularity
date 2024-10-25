import { Body, Controller, Get, Param, Post, Req, Res, Sse, UseGuards, UseInterceptors } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreatePartyDto, CurrentSongDto, PartyDto, SongOverviewDto } from '@singularity/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { PartyService } from './party.service';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { InjectMapper, MapInterceptor } from '@automapper/nestjs';
import { PartyParticipant } from './models/party-participant';
import { JoinPartyDto } from '@singularity/api-interfaces';
import { SongService } from '../song/song.service';
import { Song } from '../song/models/song.entity';
import { fromBuffer } from 'file-type';
import * as sharp from 'sharp';
import { from, map, Observable, switchMap } from 'rxjs';
import { Mapper } from '@automapper/core';

@Controller('party')
export class PartyController {

  constructor(private readonly partyService: PartyService,
              private readonly songService: SongService,
              @InjectMapper() private readonly mapper: Mapper) {
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

  @Post('my/current-song')
  @UseGuards(AuthGuard('jwt'))
  public async setCurrentSong(@Req() request: Request, @Body() currentSong: CurrentSongDto): Promise<void> {
    const party = this.partyService.getPartyByUser(request.user as User);
    this.partyService.setPartyCurrentSong(party.id, currentSong.songId);
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

  @Get(':partyId/songs')
  @UseInterceptors(MapInterceptor(Song, SongOverviewDto, { isArray: true }))
  public getSongs(@Param('partyId') partyId: string): Promise<Song[]> | Song[] {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      return [];
    }

    return this.songService.getAllSongs();
  }

  @Get(':partyId/songs/:songId/cover')
  @UseInterceptors(MapInterceptor(Song, SongOverviewDto, { isArray: true }))
  public async getSongCoverById(@Param('partyId') partyId: string, @Param('songId') songId: string, @Res() response: Response): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      return;
    }

    const buffer = await this.songService.getSongCoverFile(+songId);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime);
    response.end(buffer);
  }

  @Get(':partyId/songs/:songId/cover/small')
  public async getSmallSongCoverById(@Param('partyId') partyId: string, @Param('songId') songId: string, @Res() response: Response): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      return;
    }

    const buffer = await this.songService.getSongCoverFile(+songId);
    const fileType = await fromBuffer(buffer);
    const downscaledBuffer = await sharp(buffer)
      .resize(20, 20)
      .toBuffer();
    response.setHeader('Content-Type', fileType.mime);
    response.end(downscaledBuffer);
  }

  @Sse(':partyId/current-song')
  public getCurrentSongOfParty$(@Param('partyId') partyId: string): Observable<MessageEvent<SongOverviewDto>> {
    return this.partyService.getPartyCurrentSongId$(partyId)
      .pipe(
        switchMap((value: number) => from(this.songService.getSongById(value))),
        map((value: Song) => this.mapper.map(value, Song, SongOverviewDto)),
        map((value: SongOverviewDto) => ({ data: value }) as MessageEvent)
      );
  }
}

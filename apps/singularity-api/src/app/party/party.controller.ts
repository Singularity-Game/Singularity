import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  Sse,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { Request, Response } from 'express';
import {
  CreatePartyDto,
  CurrentSongDto,
  JoinPartyDto,
  PartyDto,
  PartyQueueItemDto,
  SongOverviewDto
} from '@singularity/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { PartyService } from './party.service';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { InjectMapper, MapInterceptor, MapPipe } from '@automapper/nestjs';
import { PartyParticipant } from './models/party-participant';
import { SongService } from '../song/song.service';
import { Song } from '../song/models/song.entity';
import { fromBuffer } from 'file-type';
import * as sharp from 'sharp';
import { map, Observable } from 'rxjs';
import { Mapper } from '@automapper/core';
import { PartyQueueItem } from './models/party-queue-item';

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

    return this.partyService.createParty(party);
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

    if(!party) {
      throw new BadRequestException('There is no Party by the given user');
    }

    const song = await this.songService.getSongById(currentSong.songId);

    if(!song) {
      throw new BadRequestException('There is no Song with the given id');
    }

    party.setCurrentSong(song);
  }

  @Get(':id')
  @UseInterceptors(MapInterceptor(Party, PartyDto))
  public getPartyById(@Param('id') id: string): Party {
    return this.partyService.getPartyById(id);
  }

  @Get(':partyId/participant/:participantId')
  public getPartyParticipant(@Param('partyId') partyId: string, @Param('participantId') participantId: string): PartyParticipant {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    return party.getParticipantById(participantId);
  }

  @Post(':partyId/join')
  public joinParty(@Param('partyId') partyId: string, @Body() joinPartyDto: JoinPartyDto): PartyParticipant {
    const participant = new PartyParticipant(joinPartyDto.name, joinPartyDto.profilePictureBase64);
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    party.join(participant);

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
      throw new BadRequestException('There is no Party with the given id');
    }

    const buffer = await this.songService.getSongCoverFile(+songId);
    const fileType = await fromBuffer(buffer);
    const downscaledBuffer = await sharp(buffer)
      .resize(512, 512)
      .toBuffer();

    response.setHeader('Content-Type', fileType.mime);
    response.end(downscaledBuffer);
  }

  @Get(':partyId/songs/:songId/cover/small')
  public async getSmallSongCoverById(@Param('partyId') partyId: string, @Param('songId') songId: string, @Res() response: Response): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
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
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    return party.getCurrentSong$()
      .pipe(
        map((value: Song) => this.mapper.map(value, Song, SongOverviewDto)),
        map((value: SongOverviewDto) => ({ data: value }) as MessageEvent)
      );
  }

  @Sse(':partyId/queue')
  public getPartyQueue$(@Param('partyId') partyId: string): Observable<MessageEvent<PartyQueueItem[]>> {
    const party = this.partyService.getPartyById(partyId);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    return party.getQueue$()
      .pipe(
        map((value: PartyQueueItem[]) => this.mapper.mapArray(value, PartyQueueItem, PartyQueueItemDto)),
        map((value: PartyQueueItemDto[]) => ({ data: value }) as MessageEvent)
      );
  }

  @Post(':partyId/queue')
  @UseInterceptors(MapInterceptor(PartyQueueItem, PartyQueueItemDto))
  public async addQueueItem(@Param('partyId') partyId: string, @Body(MapPipe(PartyQueueItemDto, PartyQueueItem)) partyQueueItem: PartyQueueItem): Promise<PartyQueueItem> {
    const party = this.partyService.getPartyById(partyId);
    const song = await this.songService.getSongById(partyQueueItem.song.id);

    if(!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const newPartyQueueItem = new PartyQueueItem(song, [partyQueueItem.participants[0]])

    console.log(newPartyQueueItem);

    party.queueSong(newPartyQueueItem);
    return newPartyQueueItem;
  }
}

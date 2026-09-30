import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Req,
  Res,
  Sse,
  UseGuards
} from '@nestjs/common';
import type { Response } from 'express';
import {
  CreatePartyDto,
  CurrentSongDto,
  JoinPartyDto,
  JoinPartyQueueItemDto, Nullable,
  PartyDto,
  PartyParticipantDto,
  PartyQueueItemDto,
  SongOverviewDto
} from '@singularity/api-interfaces';
import { AuthGuard } from '@nestjs/passport';
import { PartyService } from './party.service';
import { Party } from './models/party';
import { User } from '../user-management/models/user.entity';
import { PartyParticipant } from './models/party-participant';
import { SongService } from '../song/song.service';
import { Song } from '../song/models/song.entity';
import sharp from 'sharp';
import { map, Observable } from 'rxjs';
import { PartyQueueItem } from './models/party-queue-item';
import { PartyMapper } from './mapper/party-mapper.service';
import { PartyParticipantMapper } from './mapper/party-participant-mapper.service';
import { SongMapper } from '../song/mapper/song-mapper.service';
import { PartyQueueItemMapper } from './mapper/party-queue-item-mapper.service';
import type { RequestWithUser } from '../user-management/types/request-with-user';
import { fileTypeFromBuffer } from 'file-type';

@Controller('party')
export class PartyController {

  constructor(private readonly partyService: PartyService,
              private readonly songService: SongService,
              private readonly partyMapper: PartyMapper,
              private readonly partyParticipantMapper: PartyParticipantMapper,
              private readonly partyQueueItemMapper: PartyQueueItemMapper,
              private readonly songMapper: SongMapper) {
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  public createParty(@Req() request: RequestWithUser, @Body() createPartyDto: CreatePartyDto): PartyDto {
    const party = new Party(createPartyDto.name, request.user as User);

    const createdParty = this.partyService.createParty(party);
    return this.partyMapper.mapToDto(createdParty)!;
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  public getMyParty(@Req() request: RequestWithUser): Nullable<PartyDto> {
    const party = this.partyService.getPartyByUser(request.user as User);

    return this.partyMapper.mapToDto(party);
  }

  @Post('my/current-song')
  @UseGuards(AuthGuard('jwt'))
  public async setCurrentSong(@Req() request: RequestWithUser, @Body() currentSong: CurrentSongDto): Promise<void> {
    const party = this.partyService.getPartyByUser(request.user as User);

    if (!party) {
      throw new BadRequestException('There is no Party by the given user');
    }

    const song = await this.songService.getSongById(currentSong.songId);

    if (!song) {
      throw new BadRequestException('There is no Song with the given id');
    }

    party.setCurrentSong(song);
  }

  @Get(':id')
  public getPartyById(@Param('id') id: string): Nullable<PartyDto> {
    const party = this.partyService.getPartyById(id);
    return this.partyMapper.mapToDto(party);
  }

  @Get(':partyId/participant/:participantId')
  public getPartyParticipant(@Param('partyId') partyId: string, @Param('participantId') participantId: string): PartyParticipantDto {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const partyParticipant = party.getParticipantById(participantId);

    if (!partyParticipant) {
      throw new BadRequestException('There is no PartyParticipant with the given id');
    }

    return this.partyParticipantMapper.mapToDto(partyParticipant);
  }

  @Post(':partyId/join')
  public joinParty(@Param('partyId') partyId: string, @Body() joinPartyDto: JoinPartyDto): PartyParticipantDto {
    const participant = new PartyParticipant(joinPartyDto.name, joinPartyDto.profilePictureBase64);
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    party.join(participant);

    return this.partyParticipantMapper.mapToDto(participant);
  }

  @Get(':partyId/songs')
  public async getSongs(@Param('partyId') partyId: string): Promise<SongOverviewDto[]> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      return [];
    }

    const songs = await this.songService.getAllSongs();
    return songs.map(song => this.songMapper.mapToSongOverviewDto(song));
  }

  @Get(':partyId/songs/:songId/cover')
  public async getSongCoverById(@Param('partyId') partyId: string, @Param('songId') songId: string, @Res() response: Response): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const buffer = await this.songService.getSongCoverFile(+songId);
    const fileType = await fileTypeFromBuffer(buffer);
    const downscaledBuffer = await sharp(buffer)
      .resize(128, 128)
      .toBuffer();

    response.setHeader('Content-Type', fileType?.mime ?? '');
    response.end(downscaledBuffer);
  }

  @Get(':partyId/songs/:songId/cover/small')
  public async getSmallSongCoverById(@Param('partyId') partyId: string, @Param('songId') songId: string, @Res() response: Response): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const buffer = await this.songService.getSongCoverFile(+songId);
    const fileType = await fileTypeFromBuffer(buffer);
    const downscaledBuffer = await sharp(buffer)
      .resize(20, 20)
      .toBuffer();
    response.setHeader('Content-Type', fileType?.mime ?? '');
    response.end(downscaledBuffer);
  }

  @Sse(':partyId/current-song')
  public getCurrentSongOfParty$(@Param('partyId') partyId: string): Observable<MessageEvent<SongOverviewDto>> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    return party.getCurrentSong$()
      .pipe(
        map((value: Song) => this.songMapper.mapToSongOverviewDto(value)),
        map((value: SongOverviewDto) => ({ data: value }) as MessageEvent)
      );
  }

  @Sse(':partyId/queue')
  public getPartyQueue$(@Param('partyId') partyId: string): Observable<MessageEvent<PartyQueueItemDto[]>> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    return party.getQueue$()
      .pipe(
        map((value: PartyQueueItem[]) => value.map(queueItem => this.partyQueueItemMapper.mapToDto(queueItem))),
        map((value: PartyQueueItemDto[]) => ({ data: value }) as MessageEvent)
      );
  }

  @Post(':partyId/queue')
  public async addQueueItem(@Param('partyId') partyId: string, @Body() partyQueueItem: PartyQueueItemDto): Promise<PartyQueueItemDto> {
    const party = this.partyService.getPartyById(partyId);
    const song = await this.songService.getSongById(partyQueueItem.song.id);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const newPartyQueueItem = new PartyQueueItem(song, [partyQueueItem.participants[0]]);

    party.queueSong(newPartyQueueItem);
    return this.partyQueueItemMapper.mapToDto(newPartyQueueItem);
  }

  @Put(':partyId/queue/:queueItemId')
  public async joinQueueItem(@Param('partyId') partyId: string, @Param('queueItemId') partyQueueItemId: string, @Body() joinPartyQueueItemDto: JoinPartyQueueItemDto): Promise<PartyQueueItemDto> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const participant = party.getParticipantById(joinPartyQueueItemDto.participantId);

    if (!participant) {
      throw new BadRequestException('There is no Participant with the given id');
    }

    const partyQueueItem = party.joinQueuedSong(partyQueueItemId, participant);
    return this.partyQueueItemMapper.mapToDto(partyQueueItem);
  }

  @Delete(':partyId/queue/:queueItemId/participants/:participantId')
  public async leaveQueueITem(
    @Param('partyId') partyId: string,
    @Param('queueItemId') partyQueueItemId: string,
    @Param('participantId') partyParticipantId: string): Promise<PartyQueueItemDto> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    const participant = party.getParticipantById(partyParticipantId);

    if (!participant) {
      throw new BadRequestException('There is no Participant with the given id');
    }

    const partyQueueItem = party.leaveQueuedSong(partyQueueItemId, participant);
    return this.partyQueueItemMapper.mapToDto(partyQueueItem);
  }

  @Delete(':partyId/queue/:queueItemId')
  @UseGuards(AuthGuard('jwt'))
  public async popQueueItem(@Param('partyId') partyId: string,
                            @Param('queueItemId') partyQueueItemId: string): Promise<void> {
    const party = this.partyService.getPartyById(partyId);

    if (!party) {
      throw new BadRequestException('There is no Party with the given id');
    }

    party.popSong(partyQueueItemId)
  }
}

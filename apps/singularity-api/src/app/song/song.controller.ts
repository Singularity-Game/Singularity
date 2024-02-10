import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Express, Response } from 'express';
import 'multer';
import { memoryStorage } from 'multer';
import { SongService } from './song.service';
import { Song } from './models/song.entity';
import { MapInterceptor } from '@automapper/nestjs';
import { CreateSongDto, SongDto, SongOverviewDto } from '@singularity/api-interfaces';
import { fromBuffer } from 'file-type';
import { AdminGuard } from '../user-management/guards/admin-guard';
import { AuthGuard } from '@nestjs/passport';

@Controller('song')
export class SongController {

  constructor(private readonly songService: SongService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(Song, SongOverviewDto, { isArray: true }))
  public getAllSongs(): Promise<Song[]> {
    return this.songService.getAllSongs();
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(Song, SongDto))
  public getSongById(@Param('id') id: string): Promise<Song> {
    return this.songService.getSongById(+id, true);
  }

  @Get(':id/cover')
  @UseGuards(AuthGuard('jwt'))
  public async getSongCoverById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongCoverFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime);
    response.end(buffer);
  }

  @Get(':id/video')
  @UseGuards(AuthGuard('jwt'))
  public async getSongVideoById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongVideoFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime);
    response.end(buffer);
  }

  @Get(':id/audio')
  @UseGuards(AuthGuard('jwt'))
  public async getSongAudioById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongAudioFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime ?? '');
    response.end(buffer);
  }

  @Post()
  @UseGuards(AdminGuard())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'txtFile', maxCount: 1 },
    { name: 'audioFile', maxCount: 1 },
    { name: 'videoFile', maxCount: 1 },
    { name: 'coverFile', maxCount: 1 }
  ], {
    storage: memoryStorage()
  }))
  public createSong(@UploadedFiles() files: {
    txtFile: Express.Multer.File[],
    audioFile: Express.Multer.File[],
    videoFile: Express.Multer.File[],
    coverFile: Express.Multer.File[]}, @Body() createSongDto: CreateSongDto): Promise<Song> {
    return this.songService.createSong(files.txtFile[0], files.audioFile[0], files.videoFile[0], files.coverFile[0], createSongDto.start, createSongDto.end);
  }

  @Delete(':id')
  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(Song, SongDto))
  public deleteSong(@Param('id') id: string): Promise<Song> {
    return this.songService.deleteSong(+id);
  }
}

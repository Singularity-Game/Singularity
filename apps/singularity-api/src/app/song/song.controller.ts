import {
  BadRequestException,
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
import { CreateSongDto, Nullable, SongDownloadInfo, SongDto, SongOverviewDto } from '@singularity/api-interfaces';
import { fromBuffer } from 'file-type';
import { AdminGuard } from '../user-management/guards/admin-guard';
import { AuthGuard } from '@nestjs/passport';
import { SongUploadInfo } from '@singularity/api-interfaces';
import { SongFile } from './interfaces/song-file';
import { SongDownloadService } from './song-download.service';
import { SongIndexingService } from './song-indexing.service';
import * as sharp from 'sharp';

@Controller('song')
export class SongController {

  constructor(private readonly songService: SongService,
              private readonly songDownloadService: SongDownloadService,
              private readonly songIndexingService: SongIndexingService) {
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(MapInterceptor(Song, SongOverviewDto, { isArray: true }))
  public getAllSongs(): Promise<Song[]> {
    return this.songService.getAllSongs();
  }

  @Get('downloading-songs')
  @UseGuards(AdminGuard())
  public getDownloadingSongs(): SongDownloadInfo[] {
    return this.songDownloadService.getDownloadingSongs();
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

  @Get(':id/cover/small')
  @UseGuards(AuthGuard('jwt'))
  public async getSmallSongCoverById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongCoverFile(+id);
    const fileType = await fromBuffer(buffer);
    const downscaledBuffer = await sharp(buffer)
      .resize(20, 20)
      .toBuffer();
    response.setHeader('Content-Type', fileType.mime);
    response.end(downscaledBuffer);
  }

  @Get(':id/video')
  @UseGuards(AuthGuard('jwt'))
  public async getSongVideoById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongVideoFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime);
    response.end(buffer);
  }

  @Get(':id/video/stream')
  @UseGuards(AuthGuard('jwt'))
  public async getSongVideoStreamById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongVideoFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime);
    response.setHeader('Content-Disposition', 'inline');
    response.send(buffer);
  }

  @Get(':id/audio')
  @UseGuards(AuthGuard('jwt'))
  public async getSongAudioById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongAudioFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime ?? '');
    response.end(buffer);
  }

  @Get(':id/audio/stream')
  @UseGuards(AuthGuard('jwt'))
  public async getSongAudioStreamById(@Param('id') id: string, @Res() response: Response): Promise<void> {
    const buffer = await this.songService.getSongAudioFile(+id);
    const fileType = await fromBuffer(buffer);
    response.setHeader('Content-Type', fileType.mime ?? '');
    response.setHeader('Content-Disposition', 'inline');
    response.send(buffer);
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
  @UseInterceptors(MapInterceptor(Song, SongDto))
  public createSong(@UploadedFiles() files: {
    txtFile: Express.Multer.File[],
    audioFile: Express.Multer.File[],
    videoFile: Express.Multer.File[],
    coverFile: Express.Multer.File[]
  }, @Body() createSongDto: CreateSongDto): Promise<Nullable<Song>> {

    if(files.txtFile?.length > 0 && files.audioFile?.length > 0 && files.videoFile?.length > 0 && files.coverFile?.length > 0) {
      return this.songService.createSong(
        SongFile.fromMulterFile(files.txtFile[0]),
        SongFile.fromMulterFile(files.audioFile[0]),
        SongFile.fromMulterFile(files.videoFile[0]),
        SongFile.fromMulterFile(files.coverFile[0]),
        createSongDto.start, createSongDto.end);
    } else if (files.txtFile[0]) {
      this.songDownloadService.createSongFromYt(SongFile.fromMulterFile(files.txtFile[0]));
      return null;
    } else {
      throw new BadRequestException();
    }
  }

  @Post('upload-info')
  @UseGuards(AdminGuard())
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'txtFile', maxCount: 1 }
  ], {
    storage: memoryStorage()
  }))
  public async getSongUploadInfo(@UploadedFiles() files: {
    txtFile: Express.Multer.File[]
  }): Promise<SongUploadInfo> {
    return this.songDownloadService.getUploadInfo(SongFile.fromMulterFile(files.txtFile[0]));
  }

  @Delete(':id')
  @UseGuards(AdminGuard())
  @UseInterceptors(MapInterceptor(Song, SongDto))
  public deleteSong(@Param('id') id: string): Promise<Song> {
    return this.songService.deleteSong(+id);
  }

  @Post('index')
  @UseGuards(AdminGuard())
  public async indexSongs(): Promise<{ indexed: number; skipped: number; errors: number }> {
    return this.songIndexingService.indexSongs();
  }

  @Get('index/status')
  @UseGuards(AdminGuard())
  public getIndexingStatus(): { isIndexing: boolean } {
    return this.songIndexingService.getIndexingStatus();
  }
}

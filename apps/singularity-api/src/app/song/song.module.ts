import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongNote } from './models/song-note.entity';
import { Song } from './models/song.entity';
import { SongMapper } from './mapper/song-mapper.service';
import { SongNoteMapper } from './mapper/song-note-mapper.service';
import { ConfigModule } from '@nestjs/config';
import { YtService } from './yt.service';
import { FanartService } from './fanart.service';
import { HttpModule } from '@nestjs/axios';
import { SongDownloadService } from './song-download.service';
import { SongIndexingService } from './song-indexing.service';

@Module({
  controllers: [SongController],
  providers: [SongService, YtService, FanartService, SongDownloadService, SongIndexingService, SongMapper, SongNoteMapper],
  imports: [TypeOrmModule.forFeature([Song, SongNote]), ConfigModule, HttpModule],
  exports: [SongService, SongIndexingService, SongMapper]
})
export class SongModule {}

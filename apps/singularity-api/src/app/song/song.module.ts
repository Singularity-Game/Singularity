import { Module } from '@nestjs/common';
import { SongController } from './song.controller';
import { SongService } from './song.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SongNote } from './models/song-note.entity';
import { Song } from './models/song.entity';
import { SongProfile } from './automapper-profiles/song.profile';
import { SongNoteProfile } from './automapper-profiles/song-note.profile';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [SongController],
  providers: [SongService, SongProfile, SongNoteProfile],
  imports: [TypeOrmModule.forFeature([Song, SongNote]), ConfigModule]
})
export class SongModule {}

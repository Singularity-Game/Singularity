import { Injectable } from '@nestjs/common';
import { Song } from '../models/song.entity';
import { SongDto, SongOverviewDto } from '@singularity/api-interfaces';
import { SongNoteMapper } from './song-note-mapper.service';

@Injectable()
export class SongMapper {
  constructor(private readonly songNoteMapper: SongNoteMapper) {
  }

  public mapToDto(song: Song): SongDto {
    const songDto = new SongDto();
    songDto.id = song.id;
    songDto.name = song.name;
    songDto.artist = song.artist;
    songDto.year = song.year;
    songDto.bpm = song.bpm;
    songDto.gap = song.gap;
    songDto.start = song.start;
    songDto.end = song.end;
    songDto.pointsPerBeat = song.pointsPerBeat;
    songDto.notes = song.notes.map(note => this.songNoteMapper.mapToDto(note));

    return songDto;
  }

  public mapToSongOverviewDto(song: Song): SongOverviewDto {
    const songOverviewDto = new SongOverviewDto();
    songOverviewDto.id = song.id;
    songOverviewDto.artist = song.artist;
    songOverviewDto.year = song.year;
    songOverviewDto.name = song.name;

    return songOverviewDto;
  }
}

import { Injectable } from '@nestjs/common';
import { SongNoteDto } from '@singularity/api-interfaces';
import { SongNote } from '../models/song-note.entity';

@Injectable()
export class SongNoteMapper {

  public mapToDto(songNote: SongNote): SongNoteDto {
    const songNoteDto = new SongNoteDto();
    songNoteDto.id = songNote.id;
    songNoteDto.type = songNote.type;
    songNoteDto.text = songNote.text;
    songNoteDto.pitch = songNote.pitch;
    songNoteDto.startBeat = songNote.startBeat;
    songNoteDto.lengthInBeats = songNote.lengthInBeats;

    return songNoteDto;
  }
}

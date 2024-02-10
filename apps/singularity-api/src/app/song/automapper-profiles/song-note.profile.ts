import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, forMember, mapFrom, Mapper, MappingProfile } from '@automapper/core';
import { SongNoteDto } from '@singularity/api-interfaces';
import { SongNote } from '../models/song-note.entity';

@Injectable()
export class SongNoteProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, SongNote, SongNoteDto, forMember(dest => dest.type, mapFrom(src => src.type)));
    };
  }

}

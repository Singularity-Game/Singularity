import { Injectable } from '@nestjs/common';
import { AutomapperProfile, InjectMapper } from '@automapper/nestjs';
import { createMap, Mapper, MappingProfile } from '@automapper/core';
import { Song } from '../models/song.entity';
import { SongDto, SongOverviewDto } from '@singularity/api-interfaces';

@Injectable()
export class SongProfile extends AutomapperProfile {
  constructor(@InjectMapper() mapper: Mapper) {
    super(mapper);
  }

  get profile(): MappingProfile {
    return (mapper) => {
      createMap(mapper, Song, SongDto);
      createMap(mapper, Song, SongOverviewDto);
    };
  }
}

import { Injectable } from '@angular/core';
import { CreateSongRequest } from '../models/create-song-request';
import { Observable, switchMap } from 'rxjs';
import { ApiService } from '../../shared/api.service';
import { SongDto, SongUploadInfo } from '@singularity/api-interfaces';
import { SongService } from '../../shared/song.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LoadProgress } from '../../shared/types/load-progress';

@Injectable()
export class SongManagementService extends SongService {
  constructor(api: ApiService, indexedDbService: NgxIndexedDBService) {
    super(api, indexedDbService);
  }

  public createSong$(createSongRequest: CreateSongRequest, reportProgress: true): Observable<LoadProgress<SongDto>>;
  public createSong$(createSongRequest: CreateSongRequest, reportProgress?: false): Observable<SongDto>;
  public createSong$(createSongRequest: CreateSongRequest, reportProgress: boolean = false): Observable<SongDto> | Observable<LoadProgress<SongDto>> {
    const formData = new FormData();
    formData.append('txtFile', createSongRequest.txtFile);
    formData.append('audioFile', createSongRequest.audioFile);
    formData.append('videoFile', createSongRequest.videoFile);
    formData.append('coverFile', createSongRequest.coverFile);

    if (createSongRequest.start) {
      formData.append('start', `${createSongRequest.start}`);
    }

    if (createSongRequest.end) {
      formData.append('end', `${createSongRequest.end}`);
    }
    
    if (reportProgress) {
      return this.api.post$('api/song', formData, reportProgress) as Observable<LoadProgress<SongDto>>;
    } else {
      return this.api.post$('api/song', formData, reportProgress) as Observable<SongDto>;
    }
  }

  public getSongUploadInfo$(txtFile: File): Observable<SongUploadInfo> {
    const formData = new FormData();
    formData.append('txtFile', txtFile);

    return this.api.post$('api/song/upload-info', formData);
  }

  public deleteSong$(id: number): Observable<SongDto> {
    return this.removeDownload$(id)
      .pipe(switchMap(() => this.api.delete$<SongDto>(`api/song/${id}`)))
  }
}

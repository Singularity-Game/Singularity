import { Injectable } from '@angular/core';
import { asyncScheduler, catchError, combineLatest, filter, last, map, Observable, scheduled, switchMap } from 'rxjs';
import { SongDto, SongOverviewDto } from '@singularity/api-interfaces';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { ApiService } from './api.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { LoadProgress } from './types/load-progress';

@Injectable({
  providedIn: 'root'
})
export class SongService {
  constructor(protected readonly api: ApiService,
              private readonly indexedDbService: NgxIndexedDBService) {
  }

  public getAllSongs$(): Observable<SongOverviewDto[]> {
    return this.api.get$<SongOverviewDto[]>('api/song')
      .pipe(
        catchError(() => {
          return this.getAllOfflineSongs$();
        })
      )
  }

  public getAllOfflineSongs$(): Observable<SongDto[]> {
    return this.indexedDbService.getAll<SongDto>('songs');
  }

  public getSongById$(id: number): Observable<SongDto> {
    return this.api.get$(`api/song/${id}`);
  }

  public getSongByIdCached$(id: number): Observable<SongDto> {
    return this.isSongDownloaded$(id)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.indexedDbService.getByID<SongDto>('songs', id)
          } else {
            return this.getSongById$(id);
          }
        })
      );
  }

  public getSongCover$(songId: number): Observable<LoadProgress<string>> {
    return this.api.getFile$(`api/song/${songId}/cover`)
      .pipe(
        switchMap((progress: LoadProgress<Blob>) => {
          if (!progress.resultReady) {
            return scheduled([new LoadProgress<string>(progress.progress)], asyncScheduler);
          }

          return fromPromise(new Promise<LoadProgress<string>>((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(progress.result as Blob);
            fileReader.onload = () => resolve(new LoadProgress(100, fileReader.result as string));
            fileReader.onerror = error => reject(error);
          }));
        })
      );
  }

  public getSongCoverCachedWithProgress$(songId: number): Observable<LoadProgress<string>> {
    return this.isSongDownloaded$(songId)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.indexedDbService.getByID<{songId: number, image: string}>('songCovers', songId)
              .pipe(map((value) => new LoadProgress(100, value.image)))
          } else {
            return this.getSongCover$(songId);
          }
        })
      );
  }

  public getSongCoverCached$(songId: number): Observable<string> {
    return this.getSongCoverCachedWithProgress$(songId).pipe(
      filter((progress: LoadProgress<string>) => progress.resultReady),
      map((progress: LoadProgress<string>) => progress.result as string)
    )
  }

  public getSongVideo$(songId: number): Observable<LoadProgress<Blob>> {
    return this.api.getFile$(`api/song/${songId}/video`);
  }

  public getSongVideoCachedWithProgress$(songId: number): Observable<LoadProgress<Blob>> {
    return this.isSongDownloaded$(songId)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.indexedDbService.getByID<{songId: number, video: Blob}>('songVideos', songId)
              .pipe(map((value) => new LoadProgress(100, value.video)))
          } else {
            return this.getSongVideo$(songId);
          }
        })
      );
  }

  public getSongVideoCached$(songId: number): Observable<Blob> {
    return this.getSongVideoCachedWithProgress$(songId).pipe(
      filter((progress: LoadProgress<Blob>) => progress.resultReady),
      map((progress: LoadProgress<Blob>) => progress.result as Blob)
    )
  }

  public getSongAudio$(songId: number): Observable<LoadProgress<Blob>> {
    return this.api.getFile$(`api/song/${songId}/audio`);
  }

  public getSongAudioCachedWithProgress$(songId: number): Observable<LoadProgress<Blob>> {
    return this.isSongDownloaded$(songId)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.indexedDbService.getByID<{songId: number, audio: Blob}>('songAudios', songId)
              .pipe(map((value) => new LoadProgress(100, value.audio)))
          } else {
            return this.getSongAudio$(songId);
          }
        })
      );
  }

  public getSongAudioCached$(songId: number): Observable<Blob> {
    return this.getSongAudioCachedWithProgress$(songId).pipe(
      filter((progress: LoadProgress<Blob>) => progress.resultReady),
      map((progress: LoadProgress<Blob>) => progress.result as Blob)
    )
  }

  public isSongDownloaded$(songId: number): Observable<boolean> {
    return combineLatest([
      this.indexedDbService.getByID<SongDto>('songs', songId),
      this.indexedDbService.getByID<{songId: number, image: Blob}>('songCovers', songId),
      this.indexedDbService.getByID<{songId: number, audio: Blob}>('songAudios', songId),
      this.indexedDbService.getByID<{songId: number, video: Blob}>('songVideos', songId)
    ]).pipe(
      map(([song, cover, audio, video]) => !!song && !!cover && !!audio && !!video )
    )
  }

  public downloadSong$(songId: number): Observable<SongDto> {
    return this.isSongDownloaded$(songId)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.indexedDbService.getByID<SongDto>('songs', songId)
          } else {
            return combineLatest([
              this.getSongById$(songId),
              this.getSongCover$(songId).pipe(last()),
              this.getSongAudio$(songId).pipe(last()),
              this.getSongVideo$(songId).pipe(last())
            ]).pipe(
              switchMap(([song, cover, audio, video]: [SongDto, LoadProgress<string>, LoadProgress<Blob>, LoadProgress<Blob>]) => {
                return combineLatest([
                  this.indexedDbService.add('songs', song),
                  this.indexedDbService.add('songCovers', { songId: song.id, image: cover.result }),
                  this.indexedDbService.add('songAudios', { songId: song.id, audio: audio.result }),
                  this.indexedDbService.add('songVideos', { songId: song.id, video: video.result })
                ])
              }),
              map(([song]) => song)
            )
          }
        })
      );
  }

  public removeDownload$(songId: number): Observable<boolean> {
    return combineLatest([
      this.indexedDbService.deleteByKey('songs', songId),
      this.indexedDbService.deleteByKey('songCovers', songId),
      this.indexedDbService.deleteByKey('songAudios', songId),
      this.indexedDbService.deleteByKey('songVideos', songId)
    ]).pipe(map(([song, cover, audio, video]) => song && cover && audio && video))
  }

  public clearSongs$(): Observable<boolean> {
    return this.getAllOfflineSongs$()
      .pipe(
        switchMap((songs: SongDto[]) => {
          const deleteObservables = songs.map((song: SongDto) => this.removeDownload$(song.id));
          return combineLatest(deleteObservables);
        }),
        map((values: boolean[]) => values.reduce((previous: boolean, current: boolean) => previous && current, true))
      );
  }
}

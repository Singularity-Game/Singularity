import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongManagementService } from '../song-management.service';
import { map, Observable, pairwise, startWith, Subject, switchMap, takeUntil, tap, timer } from 'rxjs';
import { SongDownloadInfo, SongOverviewDto } from '@singularity/api-interfaces';
import { AuthenticationService } from '../../../shared/authentication.service';
import { SongListDownloadInfo, SongListDownloadState } from './song-list-download-info';

@Component({
  selector: 'singularity-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss']
})
export class SongListComponent implements OnInit, OnDestroy {
  public isAdmin$ = this.authenticationService.isAdmin$();
  public downloadingSongs$?: Observable<SongListDownloadInfo[]>;
  public songs: SongOverviewDto[] = [];

  public songListDownloadState = SongListDownloadState;

  private destroySubject = new Subject<void>();

  constructor(private readonly songManagementService: SongManagementService,
              private readonly authenticationService: AuthenticationService) {
  }

  public ngOnInit(): void {
    this.setupSongs();
    this.setupDownloadInfos();
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public removeSong(id: number): void {
    const index = this.songs.findIndex((song: SongOverviewDto) => song.id === id);

    if (index === -1) {
      return;
    }

    this.songs.splice(index, 1);
  }

  private setupDownloadInfos(): void {
    this.downloadingSongs$ = timer(0, 5000).pipe(
      switchMap(() => this.songManagementService.getDownloadingSongs$()),
      startWith([] as SongDownloadInfo[]),
      pairwise(),
      map(([firstValue, secondValue]: [SongDownloadInfo[], SongDownloadInfo[]]) => {
        const songListDownloadInfos = secondValue.map((value: SongDownloadInfo) =>
          new SongListDownloadInfo(value.title, value.artist, SongListDownloadState.loading)
        );

        const finishedDownloadInfos = firstValue.filter((value: SongDownloadInfo) => {
          const index = secondValue.findIndex((downloadInfo: SongDownloadInfo) => downloadInfo.title === value.title && downloadInfo.artist === value.artist);
          return index === -1;
        }).map((value: SongDownloadInfo) => new SongListDownloadInfo(value.title, value.artist, SongListDownloadState.finished));

        songListDownloadInfos.push(...finishedDownloadInfos);

        return songListDownloadInfos;
      }),
      tap((value: SongListDownloadInfo[]) => {
        const containsDownloadedSongs = value.findIndex((info: SongListDownloadInfo) => info.state === SongListDownloadState.finished) !== -1;

        if (containsDownloadedSongs) {
          this.setupSongs();
        }
      })
    );
  }

  private setupSongs(): void {
    this.songManagementService.getAllSongs$()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((songs: SongOverviewDto[]) => this.songs = songs);
  }
}

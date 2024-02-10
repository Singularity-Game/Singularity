import { Component, OnDestroy, OnInit } from '@angular/core';
import { SongManagementService } from '../song-management.service';
import { Observable, Subject, takeUntil } from 'rxjs';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { AuthenticationService } from '../../../shared/authentication.service';

@Component({
  selector: 'singularity-song-list',
  templateUrl: './song-list.component.html',
  styleUrls: ['./song-list.component.scss'],
})
export class SongListComponent implements OnInit, OnDestroy {
  public isAdmin$ = this.authenticationService.isAdmin$();
  public songs: SongOverviewDto[] = [];

  private destroySubject = new Subject<void>();

  constructor(private readonly songManagementService: SongManagementService,
              private readonly authenticationService: AuthenticationService) {}

  public ngOnInit(): void {
    this.songManagementService.getAllSongs$()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((songs: SongOverviewDto[]) => this.songs = songs);
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
}

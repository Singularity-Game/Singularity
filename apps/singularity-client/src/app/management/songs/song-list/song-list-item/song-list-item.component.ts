import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongManagementService } from '../../song-management.service';
import {
  asyncScheduler,
  catchError,
  filter,
  Observable,
  scheduled,
  startWith,
  Subject,
  switchMap,
  take,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import { Router } from '@angular/router';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { AuthenticationService } from '../../../../shared/authentication.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tr[singularity-song-list-item]',
  templateUrl: './song-list-item.component.html',
  styleUrls: ['./song-list-item.component.scss']
})
export class SongListItemComponent implements OnInit, OnDestroy {
  @Input() public song?: SongOverviewDto;

  @Output() public deleted = new EventEmitter<void>();

  public isAdmin$: Observable<boolean> = this.authenticationService.isAdmin$();
  public cover$?: Observable<string>;
  public isDownloaded$?: Observable<boolean>;
  public isDownloading = false;
  public isCheckingDownload = true;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly songManagementService: SongManagementService,
              private readonly dialogService: TuiDialogService,
              private readonly authenticationService: AuthenticationService,
              private readonly router: Router,
              private readonly alertService: TuiAlertService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnInit(): void {
    if (!this.song) {
      return;
    }

    this.cover$ = this.songManagementService.getSongCoverCached$(this.song?.id)
      .pipe(
        startWith(''),
        takeUntil(this.destroySubject)
      );

    this.isDownloaded$ = this.songManagementService.isSongDownloaded$(this.song.id)
      .pipe(
        tap(() => this.isCheckingDownload = false),
        takeUntil(this.destroySubject)
      );
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public start(): void {
    this.router.navigate(['/sing', this.song?.id], {
      queryParams: {
        referer: 'management/songs'
      }
    });
  }

  // TODO: Warning when leaving the page
  public download(): void {
    if (!this.song) {
      return;
    }

    this.isDownloading = true;
    const songId = this.song.id;

    this.songManagementService.downloadSong$(songId)
      .pipe(
        catchError(() => {
          this.handleError(this.transloco.translate('management.songs.songListItem.downloadSongError'), this.transloco.translate('general.error'));
          return scheduled([null], asyncScheduler);
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe(() => {
        this.isDownloading = false;
        this.isDownloaded$ = this.songManagementService.isSongDownloaded$(songId).pipe(take(1));
      });
  }

  public removeDownload(): void {
    if (!this.song) {
      return;
    }

    const songId = this.song.id;

    this.songManagementService.removeDownload$(songId)
      .subscribe(() => {
        this.isDownloaded$ = this.songManagementService.isSongDownloaded$(songId).pipe(take(1));
      });
  }

  public delete(): void {
    if (!this.song) {
      return;
    }

    const songId = this.song.id;

    const prompt: TuiPromptData = {
      content: `${this.transloco.translate('management.songs.songListItem.deletePrompt1')} <code>${this.song.artist} - ${this.song.name}</code> ${this.transloco.translate('management.songs.songListItem.deletePrompt2')}`,
      yes: this.transloco.translate('general.yes'),
      no: this.transloco.translate('general.no')
    };

    this.dialogService.open<boolean>(TUI_PROMPT, {
      label: this.transloco.translate('management.songs.songListItem.deletePromptTitle'),
      size: 's',
      data: prompt
    }).pipe(
      filter((value) => value),
      switchMap(() => this.songManagementService.deleteSong$(songId)),
      catchError(() => {
        this.handleError(this.transloco.translate('management.songs.songListItem.deleteSongError'), this.transloco.translate('general.error'));
        return scheduled([null], asyncScheduler);
      }),
      takeUntil(this.destroySubject)
    ).subscribe(() => {
      this.deleted.emit();
    });
  }

  private handleError(message: string, label: string): void {
    this.alertService.open(message, { label: label, status: TuiNotification.Error })
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }
}

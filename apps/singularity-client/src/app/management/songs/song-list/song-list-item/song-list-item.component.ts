import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongManagementService } from '../../song-management.service';
import { filter, map, Observable, of, shareReplay, Subject, switchMap, take, takeUntil, tap } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../../shared/authentication.service';
import { TranslocoService } from '@ngneat/transloco';
import { ModalService } from '@singularity/ui';
import { PromptDialogComponent } from '../../../../shared/components/prompt-dialog/prompt-dialog.component';

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
  public fastCover$?: Observable<string>;
  public isDownloaded$?: Observable<boolean>;
  public isDownloading = false;
  public isCheckingDownload = true;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly songManagementService: SongManagementService,
              private readonly modalService: ModalService,
              private readonly authenticationService: AuthenticationService,
              private readonly router: Router,
              private readonly transloco: TranslocoService) {
  }

  public ngOnInit(): void {
    if (!this.song) {
      return;
    }

    this.isDownloaded$ = this.songManagementService.isSongDownloaded$(this.song.id)
      .pipe(
        tap(() => this.isCheckingDownload = false),
        shareReplay(1),
        takeUntil(this.destroySubject)
      );

    this.cover$ = this.isDownloaded$
      .pipe(
        switchMap((downloaded: boolean) => {
          if(!this.song?.id) {
            return of('');
          }

          if (downloaded) {
            return this.songManagementService.getSongCoverCached$(this.song?.id);
          } else {
            return of(`/api/song/${this.song?.id}/cover`);
          }
        })
      )

    this.fastCover$ = this.isDownloaded$.pipe(
      map((downloaded: boolean) => {
        if (downloaded) {
          return '';
        } else {
          return `/api/song/${this.song?.id}/cover/small`;
        }
      })
    )
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
        // TODO: Add Error Handling
        // catchError(() => {
        //   this.handleError(this.transloco.translate('management.songs.songListItem.downloadSongError'), this.transloco.translate('general.error'));
        //   return scheduled([null], asyncScheduler);
        // }),
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

    const content = `${this.transloco.translate('management.songs.songListItem.deletePrompt1')} ${this.song.artist} - ${this.song.name} ${this.transloco.translate('management.songs.songListItem.deletePrompt2')}`

    this.modalService.open$<boolean, string>(PromptDialogComponent, content).pipe(
      filter((value) => !!value),
      switchMap(() => this.songManagementService.deleteSong$(songId)),
      // TODO: Add Error Handling
      // catchError(() => {
      //   this.handleError(this.transloco.translate('management.songs.songListItem.deleteSongError'), this.transloco.translate('general.error'));
      //   return throwError(() => new Error());
      // }),
      takeUntil(this.destroySubject)
    ).subscribe(() => {
      this.deleted.emit();
    });
  }
}

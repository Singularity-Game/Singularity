import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateSongForm } from './create-song-form';
import { catchError, filter, map, Observable, Subject, takeUntil, tap, throwError } from 'rxjs';
import { CreateSongRequest } from '../../models/create-song-request';
import { SongManagementService } from '../song-management.service';
import { Router } from '@angular/router';
import { LoadProgress } from '../../../shared/types/load-progress';
import { Nullable, SongDto } from '@singularity/api-interfaces';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-create-song',
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.scss']
})
export class CreateSongComponent implements OnDestroy {

  public songForm = new FormGroup<CreateSongForm>({
    txtFile: new FormControl<File | null>(null),
    coverFile: new FormControl<File | null>(null),
    videoFile: new FormControl<File | null>(null),
    audioFile: new FormControl<File | null>(null)
  });

  public destroySubject = new Subject<void>();

  public uploadProgress = 0;
  public isUploading = false;
  public isManualUpload: Nullable<boolean> = null;

  constructor(private readonly songService: SongManagementService,
              private readonly router: Router,
              private readonly alertService: TuiAlertService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public setManualUpload(manualUpload: boolean): void {
    this.isManualUpload = manualUpload;
  }

  public setTxtFile(file: Nullable<File>): void {
    this.songForm.controls.txtFile.setValue(file);
  }

  public uploadSongYt(): void {
    if (this.songForm.controls.txtFile.invalid) {
      return;
    }

    this.isUploading = true;

    this.songService.createSongYt$(this.songForm.controls.txtFile.value as File)
      .pipe(
        catchError((error) => {
          this.handleUploadError(error.error.message);
          return throwError(() => 'error');
        }),
        takeUntil(this.destroySubject)
      ).subscribe({
      next: () => {
        this.isUploading = false;
        this.router.navigate(['/', 'management', 'songs']);
      },
      error: () => this.isUploading = false
    });
  }

  public uploadSong(): void {
    if (this.songForm.invalid) {
      return;
    }

    const createSongRequest: CreateSongRequest = <CreateSongRequest>this.songForm.value;

    this.isUploading = true;

    this.songService.createSong$(createSongRequest, true)
      .pipe(
        catchError((error) => {
          this.handleUploadError(error.error.message);
          return throwError(() => 'error');
        }),
        tap((progress: LoadProgress<SongDto>) => this.uploadProgress = progress.progress),
        filter((progress: LoadProgress<SongDto>) => progress.resultReady),
        map((progress: LoadProgress<SongDto>) => progress.result),
        takeUntil(this.destroySubject)
      )
      .subscribe({
        next: () => {
          this.isUploading = false;
          this.router.navigate(['/', 'management', 'songs']);
        },
        error: () => this.isUploading = false
      });
  }

  private handleUploadError(message: string): void {
    let alert: Observable<unknown>;

    switch (message) {
      case 'SongAlreadyExists':
        alert = this.alertService.open(this.transloco.translate('management.songs.createSong.songAlreadyExistsError'), {
          label: this.transloco.translate('general.error'),
          status: TuiNotification.Error
        });
        break;
      case 'SongSaveError':
        alert = this.alertService.open(this.transloco.translate('management.songs.createSong.songSaveError'), {
          label: this.transloco.translate('general.error'),
          status: TuiNotification.Error
        });
        break;
      default:
        alert = this.alertService.open(this.transloco.translate('management.songs.createSong.error'), {
          label: this.transloco.translate('general.error'),
          status: TuiNotification.Error
        });
        break;
    }

    alert.pipe(takeUntil(this.destroySubject)).subscribe();
  }
}

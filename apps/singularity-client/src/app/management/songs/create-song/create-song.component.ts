import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CreateSongForm } from './create-song-form';
import { TuiFileLike } from '@taiga-ui/kit';
import {
  catchError,
  filter,
  map,
  Observable,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
  tap,
  throwError
} from 'rxjs';
import { CreateSongRequest } from '../../models/create-song-request';
import { SongManagementService } from '../song-management.service';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import WaveSurfer from 'wavesurfer.js';
import { Router } from '@angular/router';
import RegionsPlugin from 'wavesurfer.js/src/plugin/regions';
import { LoadProgress } from '../../../shared/types/load-progress';
import { SongDto } from '@singularity/api-interfaces';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-create-song',
  templateUrl: './create-song.component.html',
  styleUrls: ['./create-song.component.scss']
})
export class CreateSongComponent implements OnInit, AfterViewInit, OnDestroy {
  private wavesurfer?: WaveSurfer;

  public songForm = new FormGroup<CreateSongForm>({
    txtFile: new FormControl<TuiFileLike | null>(null),
    coverFile: new FormControl<TuiFileLike | null>(null),
    videoFile: new FormControl<TuiFileLike | null>(null),
    audioFile: new FormControl<TuiFileLike | null>(null)
  });

  public coverFileBase64$?: Observable<string>;
  public isPlayingSong = false;

  public destroySubject = new Subject<void>();
  public songLoaded = false;

  public uploadProgress = 0;
  public isUploading = false;

  constructor(private readonly songService: SongManagementService,
              private readonly router: Router,
              private readonly alertService: TuiAlertService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnInit(): void {
    this.coverFileBase64$ = this.getCoverFileBase64$();
  }

  public ngAfterViewInit(): void {
    this.wavesurfer = WaveSurfer.create({
      container: '#waveform',
      cursorWidth: 2,
      interact: true,
      plugins: [
        RegionsPlugin.create({
          dragSelection: true,
          maxRegions: 1
        })
      ]
    });

    this.songForm.controls.audioFile.valueChanges
      .pipe(takeUntil(this.destroySubject))
      .subscribe((file: TuiFileLike | null) => {
        if (file === null) {
          this.songLoaded = false;
          this.wavesurfer?.stop();
          return;
        }

        this.songLoaded = true;
        this.wavesurfer?.loadBlob(file as File);
      });
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public uploadSong(): void {
    if (this.songForm.invalid) {
      return;
    }

    const createSongRequest: CreateSongRequest = <CreateSongRequest>this.songForm.value;
    const region = Object.values(this.wavesurfer?.regions.list ?? {})[0];
    if (region) {
      createSongRequest.start = region.start;
      createSongRequest.end = region.end;
    }

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

  public playPauseSong(): void {
    const region = Object.values(this.wavesurfer?.regions.list ?? {})[0];

    if (this.isPlayingSong) {
      this.wavesurfer?.stop();
    } else {
      if (region) {
        this.wavesurfer?.play(region.start, region.end);
      } else {
        this.wavesurfer?.play();
      }
    }

    this.isPlayingSong = !this.isPlayingSong;
  }

  private getCoverFileBase64$(): Observable<string> {
    return this.songForm.controls.coverFile.valueChanges
      .pipe(
        switchMap((value: TuiFileLike | null) => {
          if (value === null || !(value instanceof File)) {
            return of('');
          }

          return fromPromise(new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(value as File);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
          }));
        }),
        map((value: string) => value ? value : 'tuiIconPicture'),
        startWith('tuiIconPicture'),
        takeUntil(this.destroySubject)
      );
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

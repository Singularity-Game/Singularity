import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Nullable, SongUploadInfo } from '@singularity/api-interfaces';
import { filter, forkJoin, map, Observable, of, Subject, switchMap, tap } from 'rxjs';
import { SongManagementService } from '../../song-management.service';

@Component({
  selector: 'singularity-create-song-uplodad-txt-file-component',
  templateUrl: './create-song-uplodad-txt-file-component.component.html',
  styleUrls: ['./create-song-uplodad-txt-file-component.component.scss']
})
export class CreateSongUplodadTxtFileComponentComponent implements OnInit {
  public txtFileSubject = new Subject<Nullable<File>>();
  public songUploadInfo$?: Observable<SongUploadInfo>;
  public isLoading = false;
  public isManualUpload = false;

  @Output() file = new EventEmitter<Nullable<File>>();
  @Output() manualUpload = new EventEmitter<boolean>();

  constructor(private readonly songManagementService: SongManagementService) {
  }

  public ngOnInit(): void {
    this.songUploadInfo$ = this.txtFileSubject.asObservable().pipe(
      filter((file: Nullable<File>) => file != null),
      tap(() => this.isLoading = true),
      switchMap((file: Nullable<File>) => forkJoin({file: of(file), info: this.songManagementService.getSongUploadInfo$(file as File)})),
      tap(() => this.isLoading = false),
      tap(({file, info}) => {
        if (!info.isVideoDownloadable) {
          this.triggerManualUpload(file);
        } else {
          this.triggerAutomaticUpload(file);
        }
      }),
      map(({info}) => info)
    )
  }

  public txtFileChanged(event: any): void {
    this.txtFileSubject.next(event?.target?.files[0]);
    this.file.emit(event?.target?.files[0]);
  }

  public triggerAutomaticUpload(file: Nullable<File>): void {
    if(!file) {
      return;
    }

    this.file.emit(file);
    this.manualUpload.emit(false);
  }

  public triggerManualUpload(file: Nullable<File>): void {
    if(!file) {
      return;
    }

    this.file.emit(file);
    this.manualUpload.emit(true);
    this.isManualUpload = true;
  }

  public remove(): void {
    this.txtFileSubject.next(null);
    this.file.emit(null);
  }
}

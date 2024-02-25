import { Component, OnInit } from '@angular/core';
import { Nullable, SongUploadInfo } from '@singularity/api-interfaces';
import { TuiFileLike } from '@taiga-ui/kit';
import { filter, Observable, Subject, switchMap, tap } from 'rxjs';
import { SongManagementService } from '../../song-management.service';

@Component({
  selector: 'singularity-create-song-uplodad-txt-file-component',
  templateUrl: './create-song-uplodad-txt-file-component.component.html',
  styleUrls: ['./create-song-uplodad-txt-file-component.component.scss']
})
export class CreateSongUplodadTxtFileComponentComponent implements OnInit {
  public txtFile: Nullable<TuiFileLike> = null;
  public txtFileSubject = new Subject<Nullable<TuiFileLike>>();
  public songUploadInfo$?: Observable<SongUploadInfo>;
  public isLoading = false;

  constructor(private readonly songManagementService: SongManagementService) {
  }

  public ngOnInit(): void {
    this.songUploadInfo$ = this.txtFileSubject.asObservable().pipe(
      filter((file: Nullable<TuiFileLike>) => file != null),
      tap(() => this.isLoading = true),
      switchMap((file: Nullable<TuiFileLike>) => this.songManagementService.getSongUploadInfo$(file as File)),
      tap(() => this.isLoading = false)
    )
  }

  public txtFileChanged(): void {
    this.txtFileSubject.next(this.txtFile);
  }
}

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  Output,
  ViewChild
} from '@angular/core';
import { combineLatest, delay, filter, map, Observable, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { SongDto } from '@singularity/api-interfaces';
import { SongService } from '../../shared/song.service';
import { BpmService } from '../services/bpm.service';
import { MicrophoneService } from '../services/microphone.service';
import { Singer } from '../singer/singer';
import { SingerFactory } from '../services/singer-factory.service';
import { LoadProgress } from '../../shared/types/load-progress';
import { NoteHelper } from '../../shared/helpers/note-helper';
import { TuiDialogService } from '@taiga-ui/core';
import { PolymorpheusComponent } from '@tinkoff/ng-polymorpheus';
import { SingScoreDialogComponent } from '../dialogs/sing-score-dialog/sing-score-dialog.component';

@Component({
  selector: 'singularity-sing',
  templateUrl: './sing.component.html',
  styleUrls: ['./sing.component.scss'],
})
export class SingComponent implements AfterViewInit, OnDestroy {
  @Input() public songId?: number;
  @Output() public stopped = new EventEmitter<void>();
  @ViewChild('videoElement') public videoElement?: ElementRef<HTMLVideoElement>;

  public song: SongDto | null = null;
  public singers?: Singer[];
  public loadingProgress = 0;
  public currentBeat$?: Observable<number>;
  public singerScores$?: Observable<number[]>;
  private audioPlayer?: HTMLAudioElement;
  private destroySubject = new Subject<void>();

  constructor(private readonly songService: SongService,
              private readonly bpmService: BpmService,
              private readonly microphoneService: MicrophoneService,
              private readonly singerFactory: SingerFactory,
              private readonly dialogService: TuiDialogService) { }

  @HostListener('document:keydown', ['$event'])
  public handleKeyboardEvent(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.stopSong()
    }
  }

  public ngAfterViewInit(): void {
    this.loadSong();
    this.currentBeat$ = this.bpmService.getBeat$();
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
    this.stopSong(true);
  }

  private loadSong(): void {
    if (!this.songId) {
      return;
    }

    const song$ = this.songService.getSongByIdCached$(this.songId);
    const video$ = this.songService.getSongVideoCachedWithProgress$(this.songId);
    const audio$ = this.songService.getSongAudioCachedWithProgress$(this.songId);

    combineLatest([song$, audio$, video$])
      .pipe(
        tap(([song, audioProgess, videoProgress]: [SongDto, LoadProgress<Blob>, LoadProgress<Blob>]) => {
          this.loadingProgress = (audioProgess.progress + videoProgress.progress) / 2
        }),
        filter(([song, audioProgress, videoProgress]: [SongDto, LoadProgress<Blob>, LoadProgress<Blob>]) => audioProgress.resultReady && videoProgress.resultReady),
        map(([song, audioProgress, videoProgress]: [SongDto, LoadProgress<Blob>, LoadProgress<Blob>]) => {
          return [song, audioProgress.result, videoProgress.result] as [SongDto, Blob, Blob];
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe(([song, audio, video]: [SongDto, Blob, Blob]) => {
        this.bpmService.setBPM(song.bpm, song.gap);

        if (this.videoElement) {
          this.videoElement.nativeElement.src = URL.createObjectURL(video);
          this.videoElement.nativeElement.oncontextmenu = () => false;
          this.videoElement.nativeElement.muted = true;
        }

        this.audioPlayer = new Audio(URL.createObjectURL(audio));
        this.song = song;
        this.setupSingers();

        this.startSong();
      });
  }

  private startSong(): void {
    if (!this.audioPlayer) {
      return;
    }

    this.audioPlayer.play()
      .then(() => {
        this.videoElement?.nativeElement.play();
        this.bpmService.start();
        this.setupEndScoreWindow();
      });

    this.audioPlayer.onpause = () => this.stopSong(true);
  }

  private stopSong(abort = false): void {
    this.audioPlayer?.pause();
    // this.videoElement?.nativeElement.pause();
    this.audioPlayer?.remove();
    this.bpmService.stop();

    if (abort) {
      this.stopped.emit();
    }
  }

  private setupSingers(): void {
    if(!this.song) {
      return;
    }

    this.singers = this.singerFactory.createSingers(this.song);
    this.singerScores$ = combineLatest(this.singers.map((singer: Singer) => singer.getSingerScore$()));
  }

  private setupEndScoreWindow() {
    const lastNote = NoteHelper.getLastNote(this.song?.notes ?? []);

    combineLatest([
      this.bpmService.getBeat$(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      this.singerScores$!
    ])
      .pipe(
        filter(([beat, scores]: [number, number[]]) => beat === lastNote.startBeat + lastNote.lengthInBeats),
        delay(2000),
        switchMap(([beat, scores]: [number, number[]]) => {
          return this.dialogService.open(new PolymorpheusComponent(SingScoreDialogComponent), {
            data: {
              singers: this.singers,
              scores: scores,
            },
            closeable: false,
            dismissible: false
          })
        }),
        takeUntil(this.destroySubject)
      ).subscribe(() => {
        if (!this.audioPlayer) {
          return;
        }

        if (this.audioPlayer.paused) {
          this.stopped.emit();
        } else {
          this.audioPlayer.onended = () => this.stopSong(true);
        }
    });
  }
}

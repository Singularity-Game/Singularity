import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../../song.service';
import { combineLatest, map, of, Subject, switchMap, takeUntil } from 'rxjs';

@Component({
  selector: 'singularity-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrl: './audio-player.component.scss'
})
export class AudioPlayerComponent implements AfterViewInit, OnDestroy {
  @Input() public songs: SongOverviewDto[] = [];
  @Input() public set index(index: number) {
    this.songIndex = index;
    this.playSong();
  }
  @Input() public set volume(volume: number) {
    this.audio.volume = volume / 100;
  }

  @Input()
  public set paused(paused: boolean) {
    if(paused) {
      this.pauseSong();
    } else {
      this.resumeSong();
    }
  }

  @Input() showFade = true;

  @Output() public songFinished = new EventEmitter<void>();
  @Output() public timeRemaining = new EventEmitter<number>();

  @ViewChild('video') private video?: ElementRef<HTMLVideoElement>;

  private songIndex = 0;
  private readonly audio = new Audio();
  private readonly destroySubject = new Subject<void>();

  constructor(private readonly songService: SongService) {
  }


  public ngAfterViewInit(): void {
    this.playSong();

    this.audio.onended = () => this.songFinished.emit();
    this.audio.ontimeupdate = () => {
      this.timeRemaining.emit(Math.round(this.audio.duration - this.audio.currentTime));
    }
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();

    this.audio.pause();
    this.audio.src = '';
  }

  private playSong(): void {
    const song = this.songs[this.songIndex];

    this.songService.isSongDownloaded$(song.id)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return combineLatest([
              this.songService.getSongAudioCached$(song.id),
              this.songService.getSongVideoCached$(song.id)
            ]);
          } else {
            return of([`/api/song/${song.id}/audio/stream`, `/api/song/${song.id}/video/stream`]);
          }
        }),
        map(([audio, video]) => {
          let newAudio = audio;
          let newVideo = video;

          if (audio instanceof Blob) {
            newAudio = URL.createObjectURL(audio);
          }

          if (video instanceof Blob) {
            newVideo = URL.createObjectURL(video);
          }

          return [newAudio, newVideo] as [string, string];
        }),
        takeUntil(this.destroySubject)
      ).subscribe(([audio, video]) => {
        this.audio.src = audio;
        this.audio.play();

        if(!this.video) {
          return;
        }

        this.video.nativeElement.src = video;
        this.video.nativeElement.muted = true;
        this.video.nativeElement.play();
    });
  }

  private pauseSong(): void {
    this.audio.pause();
    this.video?.nativeElement.pause();
  }

  private resumeSong(): void {
    this.audio.play();
    this.video?.nativeElement.play();
  }
}

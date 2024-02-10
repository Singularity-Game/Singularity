import { Component, ElementRef, Input, OnChanges, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Nullable, SongOverviewDto } from '@singularity/api-interfaces';
import { SongService } from '../../shared/song.service';
import { asyncScheduler, combineLatest, Observable, scheduled, Subject, switchMap, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'singularity-audio-player',
  templateUrl: './audio-player.component.html',
  styleUrls: ['./audio-player.component.scss'],
})
export class AudioPlayerComponent implements OnInit, OnChanges, OnDestroy {
  @ViewChild('videoElement') public videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('audioElement') public audioElement?: ElementRef<HTMLAudioElement>;
  @Input() public playList: Nullable<SongOverviewDto[]> = [];
  @Input() public shuffle = false;
  public currentTime = 0;
  public currentSongIndex = 0;
  public currentSong?: SongOverviewDto;
  public showVideo = true;
  public cover$?: Observable<string>;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly songService: SongService,
              private readonly router: Router) {
  }
  public ngOnInit(): void {
    this.setup();
    this.nextSong();
  }

  public ngOnChanges(): void {
    this.setup();
    this.nextSong();
  }

  public ngOnDestroy() {
    const audio = this.audioElement?.nativeElement;
    if (!audio) {
      return;
    }

    audio.pause();
    audio.disableRemotePlayback = true;

    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public toggle(): void {
    const audio = this.audioElement?.nativeElement;
    if (!audio) {
      return;
    }

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }

  public startSinging() {
    this.router.navigate(['sing', this.currentSong?.id], {
      queryParams: {
        referer: 'play'
      }
    });
  }

  private setup(): void {
    if (this.shuffle) {
      this.playList = this.playList?.sort(() => 0.5 - Math.random()) ?? [];
    }

    const audio = this.audioElement?.nativeElement;
    if (!audio) {
      return;
    }

    audio.volume = 0.1;
    audio.onended = () => this.nextSong();
    audio.onpause = () => this.onPause();
    audio.onplay = () => this.onPlay();
    audio.disableRemotePlayback = false;

    if (this.videoElement) {
      this.videoElement.nativeElement.oncontextmenu = () => false;
      this.videoElement.nativeElement.muted = true;
    }
  }

  private nextSong(): void {
    if (!this.playList || this.playList.length === 0) {
      return;
    }

    if (this.currentSongIndex === this.playList.length) {
      this.currentSongIndex = 0;
    }

    const nextSong = this.playList[this.currentSongIndex];
    this.cover$ = this.songService.getSongCoverCached$(nextSong.id);
    const audio$ = this.songService.getSongAudioCached$(nextSong.id);
    const video$ = this.songService.isSongDownloaded$(nextSong.id)
      .pipe(
        switchMap((downloaded: boolean) => {
          if (downloaded) {
            return this.songService.getSongVideoCached$(nextSong.id);
          } else {
            return scheduled([null], asyncScheduler);
          }
        })
      );

    combineLatest([
      audio$,
      video$
    ]).pipe(
        takeUntil(this.destroySubject)
      ).subscribe(([audio, video]: [Blob, Nullable<Blob>]) => {
        const audioUrl = URL.createObjectURL(audio);
        let videoUrl = null;

        if (video) {
          videoUrl = URL.createObjectURL(video);
          this.showVideo = true;
        } else {
          this.showVideo = false;
        }

        if (this.playList) {
          this.currentSong = this.playList[this.currentSongIndex];
        }

        this.currentSongIndex++;
        this.playSong(audioUrl, videoUrl);
    });
  }

  private playSong(audioUrl: string, videoUrl: Nullable<string>) {
    if (this.videoElement && videoUrl !== null) {
      this.videoElement.nativeElement.src = videoUrl;
      this.videoElement.nativeElement.oncontextmenu = () => false;
      this.videoElement.nativeElement.muted = true;
      this.videoElement.nativeElement.play();
    }

    const audio = this.audioElement?.nativeElement;
    if (!audio) {
      return;
    }
    audio.src = audioUrl;
    audio.play();
    audio.volume = 0.1;
  }

  private onPause(): void {
    if (!this.videoElement?.nativeElement.paused && this.videoElement?.nativeElement.src) {
      this.videoElement?.nativeElement.pause();
    }
  }

  private onPlay(): void {
    if (this.videoElement?.nativeElement.paused) {
      this.videoElement?.nativeElement.play();
    }
  }
}

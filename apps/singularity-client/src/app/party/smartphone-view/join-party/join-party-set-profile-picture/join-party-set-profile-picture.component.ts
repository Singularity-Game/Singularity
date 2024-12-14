import { AfterViewInit, Component, ElementRef, EventEmitter, OnDestroy, Output, ViewChild } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-join-party-set-profile-picture',
  templateUrl: './join-party-set-profile-picture.component.html',
  styleUrl: './join-party-set-profile-picture.component.scss'
})
export class JoinPartySetProfilePictureComponent implements AfterViewInit, OnDestroy {
  @ViewChild('video') videoElement?: ElementRef<HTMLVideoElement>;
  @ViewChild('canvas') canvasElement?: ElementRef<HTMLCanvasElement>;

  @Output() photoBase64 = new EventEmitter<string>();

  public photoTaken = false;

  private readonly WIDTH = 500;
  private readonly HEIGHT = 500;

  private stream: Nullable<MediaStream> = null;

  public ngAfterViewInit(): void {
    const constraints: MediaStreamConstraints = {
      video: {
        width: this.WIDTH,
        height: this.HEIGHT,
        facingMode: 'user'
      }
    };

    navigator.mediaDevices.getUserMedia(constraints)
      .then((stream) => {
        if (!this.videoElement) {
          return;
        }

        this.videoElement.nativeElement.srcObject = stream;
        this.videoElement.nativeElement.play();
        this.stream = stream;
      });
  }

  public ngOnDestroy(): void {
    this.stream?.getTracks().forEach((track) => track.stop());
  }

  public takePicture(): void {
    const videoElement = this.videoElement?.nativeElement;

    if(!videoElement) {
      return;
    }
    this.drawImageToCanvas(videoElement);
    this.photoTaken = true;
  }

  public retakePicture(): void {
    this.photoTaken = false;
  }

  public skip(): void {
    this.photoBase64.emit('');
  }

  public continue(): void {
    const base64 = this.canvasElement?.nativeElement.toDataURL();
    this.photoBase64.emit(base64);
  }

  private drawImageToCanvas(image: CanvasImageSource): void {
    const canvasElement = this.canvasElement?.nativeElement;

    if(!canvasElement) {
      return;
    }

    canvasElement.getContext('2d')?.drawImage(image, 0, 0, canvasElement.width, canvasElement.height);
  }
}

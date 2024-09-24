import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-blurry-background-blob',
  templateUrl: './blurry-background-blob.component.html',
  styleUrl: './blurry-background-blob.component.scss'
})
export class BlurryBackgroundBlobComponent {

  @ViewChild('blob') blob?: ElementRef<HTMLDivElement>;
  @ViewChild('container') container?: ElementRef<HTMLDivElement>;

  public mouseInside = false;

  @HostListener('window:mousemove', ['$event'])
  public handleMouseMove(event: MouseEvent): void {
    if(!this.blob || !this.container) {
      return;
    }

    const { left, top } = this.container.nativeElement.getBoundingClientRect();

    this.blob.nativeElement.style.left = `${event.clientX - left}px`;
    this.blob.nativeElement.style.top = `${event.clientY - top}px`;
  }

  public handleMouseEnter(): void {
    this.mouseInside = true;
  }

  public handleMouseLeave(): void {
    this.mouseInside = false;
  }
}

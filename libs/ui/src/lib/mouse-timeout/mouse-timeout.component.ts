import { Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-mouse-timeout',
  templateUrl: './mouse-timeout.component.html',
  styleUrl: './mouse-timeout.component.scss'
})
export class MouseTimeoutComponent {
  private mouseTimeout?: NodeJS.Timeout;

  @Input() duration = 2000;

  @ViewChild('timeout') timeoutElement?: ElementRef<HTMLDivElement>;

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    this.timeoutElement?.nativeElement?.style?.setProperty('cursor', 'initial');

    if(this.mouseTimeout) {
      clearTimeout(this.mouseTimeout);
    }

    this.mouseTimeout = setTimeout(() => this.timeoutElement?.nativeElement?.style?.removeProperty('cursor'), this.duration);
  }
}

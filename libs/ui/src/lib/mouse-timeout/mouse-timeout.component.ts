import { ChangeDetectionStrategy, Component, ElementRef, HostListener, Input, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-mouse-timeout',
  templateUrl: './mouse-timeout.component.html',
  styleUrl: './mouse-timeout.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class MouseTimeoutComponent {
  private mouseTimeout?: unknown;

  @Input() duration = 2000;

  @ViewChild('timeout') timeoutElement?: ElementRef<HTMLDivElement>;

  @HostListener('document:mousemove', ['$event'])
  public onMouseMove(event: MouseEvent): void {
    this.timeoutElement?.nativeElement?.style?.setProperty('cursor', 'initial');

    if (this.mouseTimeout) {
      clearTimeout(this.mouseTimeout as any);
    }

    this.mouseTimeout = setTimeout(() => this.timeoutElement?.nativeElement?.style?.removeProperty('cursor'), this.duration);
  }
}

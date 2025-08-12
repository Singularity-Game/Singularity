import { AfterViewInit, Component, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-viewport-renderer',
  templateUrl: './viewport-renderer.component.html',
  styleUrl: './viewport-renderer.component.scss'
})
export class ViewportRendererComponent implements AfterViewInit, OnDestroy {
  @Input() public width = 0;
  @Input() public height = 0;

  public show = false;

  @ViewChild('placeholder') public placeholder?: ElementRef<HTMLDivElement>;

  private intersectionObserver?: IntersectionObserver;

  public ngAfterViewInit(): void {
    this.intersectionObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        this.show = true;
      }
    });

    if (this.placeholder) {
      this.intersectionObserver.observe(this.placeholder.nativeElement);
    }
  }

  public ngOnDestroy(): void {
    this.intersectionObserver?.disconnect();
  }
}

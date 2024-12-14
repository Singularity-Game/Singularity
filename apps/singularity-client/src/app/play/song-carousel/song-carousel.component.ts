import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { CarouselComponent, OwlOptions } from 'ngx-owl-carousel-o';
import { SongOverviewDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-song-carousel',
  templateUrl: './song-carousel.component.html',
  styleUrl: './song-carousel.component.scss'
})
export class SongCarouselComponent {
  @Input() public songs: SongOverviewDto[] = [];
  @Output() public changed = new EventEmitter<number>();

  @ViewChild(CarouselComponent) private carousel?: CarouselComponent;

  public carouselOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    fluidSpeed: true,
    autoWidth: true,
    items: window.innerWidth / 270,
    dots: false
  }
  public dragging = false;

  public onDrag(drag: any): void {
    this.dragging = drag.dragging;
  }

  public next(): void {
    this.carousel?.next();
  }

  public previous(): void {
    this.carousel?.prev();
  }

  public onChange(changed: any): void {
    this.changed.emit(changed.startPosition);
  }
}

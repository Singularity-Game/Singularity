import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'sui-card3d',
  templateUrl: './card3d.component.html',
  styleUrls: ['./card3d.component.scss']
})
export class Card3dComponent implements AfterViewInit {
  @ViewChild('card') card?: ElementRef<HTMLDivElement>;

  public ngAfterViewInit(): void {
    if(!this.card) {
      return;
    }

    const nativeElement = this.card.nativeElement;

    nativeElement.onmousemove = (event: MouseEvent) => this.handleMouseMove(event, nativeElement);
    nativeElement.onmouseleave = (event: MouseEvent) => this.handleMouseLeave(nativeElement);
  }

  private handleMouseMove(event: MouseEvent, nativeElement: HTMLElement): void {
    const { left, top, width, height } = nativeElement.getBoundingClientRect();
    const x = (event.clientX - left - width / 2) / 25;
    const y = (event.clientY - top - height / 2) / 25;
    nativeElement.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
    nativeElement.style.transition = `none`
  }

  private handleMouseLeave(nativeElement: HTMLElement): void {
    nativeElement.style.transform = `rotateY(0deg) rotateX(0deg)`;
    nativeElement.style.transition = `200ms ease`;
  }
}

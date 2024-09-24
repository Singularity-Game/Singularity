import { AfterViewInit, Component, ElementRef, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'sui-tooltip',
  templateUrl: './tooltip.component.html',
  styleUrl: './tooltip.component.scss'
})
export class TooltipComponent implements AfterViewInit {
  private to: Nullable<gsap.QuickToFunc> = null;

  @Input() public tooltip?: TemplateRef<unknown>;
  @Input() public left = 0;
  @Input() public top = 0;

  @Input() public set tilt(tilt: number) {
    if(!this.tooltipElement) {
      return;
    }

    gsap.to(this.tooltipElement.nativeElement, {
      rotateZ: tilt,
      ease: 'back.out',
      duration: 0.5
    }).play();
  }

  @ViewChild('tooltipElement') private tooltipElement?: ElementRef<HTMLDivElement>;

  public ngAfterViewInit() {
    if(!this.tooltipElement) {
      return;
    }

    gsap.fromTo(this.tooltipElement.nativeElement, {
      scale: 0,
      translateX: '-50%',
      translateY: 0,
      ease: 'back.out',
      duration: 0.5
    }, {
      scale: 1,
      translateX: '-50%',
      translateY: '-120%',
      ease: 'back.out',
      duration: 0.5
    }).play();
  }

  public out() {
    if(!this.tooltipElement) {
      return;
    }

    gsap.to(this.tooltipElement.nativeElement, {
      scale: 0,
      translateX: '-50%',
      translateY: 0,
      ease: 'back.out',
      duration: 0.5
    });
  }
}

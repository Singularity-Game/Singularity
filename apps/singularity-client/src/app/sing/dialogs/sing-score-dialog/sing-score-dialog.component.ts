import { AfterViewInit, Component, ElementRef, Inject, ViewChild } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import { Singer } from '../../singer/singer';
import JSConfetti from 'js-confetti';

@Component({
  selector: 'singularity-sing-score-dialog',
  templateUrl: './sing-score-dialog.component.html',
  styleUrls: ['./sing-score-dialog.component.scss']
})
export class SingScoreDialogComponent implements AfterViewInit {

  @ViewChild('confetti') public canvas?: ElementRef<HTMLCanvasElement>;

  public highestScore: number;
  public bestSinger: Singer;

  constructor(@Inject(POLYMORPHEUS_CONTEXT)
              public readonly context: TuiDialogContext<boolean, { singers: Singer[], scores: number[] }>) {

    this.highestScore = this.context.data.scores.reduce((previous: number, current: number) => current > previous ? current : previous, 0);
    const bestSingerIndex = this.context.data.scores.indexOf(this.highestScore);
    this.bestSinger = this.context.data.singers[bestSingerIndex];

    setTimeout(() => this.context.completeWith(true), 10000)
  }

  public ngAfterViewInit(): void {
    if (!this.canvas) {
      return;
    }

    const conffeti = new JSConfetti({
      canvas: this.canvas.nativeElement
    });

    conffeti.addConfetti();
  }
}

import { Component, Inject } from '@angular/core';
import { POLYMORPHEUS_CONTEXT } from '@tinkoff/ng-polymorpheus';
import { TuiDialogContext } from '@taiga-ui/core';
import * as Tone from 'tone';

@Component({
  selector: 'singularity-audio-context-activation-dialog',
  templateUrl: './audio-context-activation-dialog.component.html',
  styleUrls: ['./audio-context-activation-dialog.component.scss'],
})
export class AudioContextActivationDialogComponent {
  constructor(@Inject(POLYMORPHEUS_CONTEXT) private readonly context: TuiDialogContext<boolean>) {
  }

  public activateContext(): void {
    Tone.context.resume();
    this.context.completeWith(true);
  }

}

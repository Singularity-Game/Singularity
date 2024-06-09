import { Component } from '@angular/core';
import * as Tone from 'tone';
import { ModalContext } from '@singularity/ui';

@Component({
  selector: 'singularity-audio-context-activation-dialog',
  templateUrl: './audio-context-activation-dialog.component.html',
  styleUrls: ['./audio-context-activation-dialog.component.scss'],
})
export class AudioContextActivationDialogComponent {
  constructor(private readonly modalContext: ModalContext<boolean>) {
  }

  public activateContext(): void {
    Tone.context.resume();
    this.modalContext.close(true);
  }

}

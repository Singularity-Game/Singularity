import { Component, OnInit } from '@angular/core';
import { ModalContext } from '@singularity/ui';

@Component({
  selector: 'singularity-prompt-dialog',
  templateUrl: './prompt-dialog.component.html',
  styleUrl: './prompt-dialog.component.scss'
})
export class PromptDialogComponent implements OnInit {

  public message = '';

  constructor(private readonly modalContext: ModalContext<boolean, string>) {
  }

  public ngOnInit(): void {
    this.message = this.modalContext.data;
  }

  public yes(): void {
    this.modalContext.close(true);
  }

  public no(): void {
    this.modalContext.close(false);
  }


}

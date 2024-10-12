import { Component } from '@angular/core';
import { ModalContext } from '@singularity/ui';

@Component({
  selector: 'singularity-party-qr-code',
  templateUrl: './party-qr-code.component.html',
  styleUrl: './party-qr-code.component.scss'
})
export class PartyQrCodeComponent {
  public link = `${window.location.origin}/party/${this.modalContext.data}`;

  constructor(private readonly modalContext: ModalContext<void, string>) {
  }

  public close(): void {
    this.modalContext.close();
  }
}

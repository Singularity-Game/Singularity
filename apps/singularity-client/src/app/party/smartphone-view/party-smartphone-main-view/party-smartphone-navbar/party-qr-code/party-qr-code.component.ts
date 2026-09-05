import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ModalContext } from '@singularity/ui';

@Component({
  selector: 'singularity-party-qr-code',
  templateUrl: './party-qr-code.component.html',
  styleUrl: './party-qr-code.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class PartyQrCodeComponent {
  private readonly modalContext = inject<ModalContext<void, string>>(ModalContext);

  public link = `${window.location.origin}/party/${this.modalContext.data}`;

  public close(): void {
    this.modalContext.close();
  }
}

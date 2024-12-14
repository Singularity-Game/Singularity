import { Component, Input } from '@angular/core';
import { PartyDto, PartyParticipantDto } from '@singularity/api-interfaces';
import { ModalService } from '@singularity/ui';
import { PartyQrCodeComponent } from './party-qr-code/party-qr-code.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'singularity-smartphone-navbar',
  templateUrl: './party-smartphone-navbar.component.html',
  styleUrl: './party-smartphone-navbar.component.scss'
})
export class PartySmartphoneNavbarComponent {
  @Input() party?: PartyDto;
  @Input() participant?: PartyParticipantDto;

  constructor(private readonly modalService: ModalService,
              private readonly activatedRoute: ActivatedRoute) {
  }

  public openQRCode(): void {
    this.modalService.open$(PartyQrCodeComponent, this.activatedRoute.snapshot.paramMap.get('id'))
  }
}

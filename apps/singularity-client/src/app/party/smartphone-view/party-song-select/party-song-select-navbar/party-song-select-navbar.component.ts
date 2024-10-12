import { Component, Input } from '@angular/core';
import { PartyDto, PartyParticipantDto } from '@singularity/api-interfaces';
import { ModalService } from '@singularity/ui';
import { PartyQrCodeComponent } from './party-qr-code/party-qr-code.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'singularity-party-song-select-navbar',
  templateUrl: './party-song-select-navbar.component.html',
  styleUrl: './party-song-select-navbar.component.scss'
})
export class PartySongSelectNavbarComponent {
  @Input() party?: PartyDto;
  @Input() participant?: PartyParticipantDto;

  constructor(private readonly modalService: ModalService,
              private readonly activatedRoute: ActivatedRoute) {
  }

  public openQRCode(): void {
    this.modalService.open$(PartyQrCodeComponent, this.activatedRoute.snapshot.paramMap.get('id'))
  }
}

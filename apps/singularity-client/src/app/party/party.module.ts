import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PartyRoutingModule } from './party-routing.module';
import { CreatePartyComponent } from './tv-view/create-party/create-party.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingularityUiModule } from '@singularity/ui';
import { TranslocoModule } from '@ngneat/transloco';
import { PartyService } from './party.service';
import { PartyLobbyComponent } from './tv-view/party-lobby/party-lobby.component';
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';
import { PartyParticipantService } from './party-participant.service';
import { JoinPartyComponent } from './smartphone-view/join-party/join-party.component';
import { PartyParticipantGuard } from './guards/party-participant.guard';
import {
  JoinPartySetUsernameComponent
} from './smartphone-view/join-party/join-party-set-username/join-party-set-username.component';
import {
  JoinPartySetProfilePictureComponent
} from './smartphone-view/join-party/join-party-set-profile-picture/join-party-set-profile-picture.component';
import { JoinPartyReadyComponent } from './smartphone-view/join-party/join-party-ready/join-party-ready.component';
import {
  PartySmartphoneMainViewComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-main-view.component';
import {
  PartySmartphoneHomeComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-home/party-smartphone-home.component';
import {
  PartySmartphoneNavbarComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-navbar/party-smartphone-navbar.component';
import {
  PartyQrCodeComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-navbar/party-qr-code/party-qr-code.component';
import {
  PartySmartphoneHeaderComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-header/party-smartphone-header.component';
import {
  PartySongSelectItemComponent
} from './smartphone-view/party-smartphone-main-view/party-song-select/party-song-select-item/party-song-select-item.component';
import { PartySongQueueItemComponent } from './smartphone-view/party-smartphone-main-view/party-smartphone-home/party-song-queue-item/party-song-queue-item.component';

@NgModule({
  declarations: [CreatePartyComponent, PartyLobbyComponent, PartyTVViewComponent, PartySmartphoneViewComponent, JoinPartyComponent, PartySmartphoneHomeComponent, JoinPartySetUsernameComponent, JoinPartySetProfilePictureComponent, JoinPartyReadyComponent, PartySmartphoneNavbarComponent, PartyQrCodeComponent, PartySmartphoneHeaderComponent, PartySongSelectItemComponent, PartySmartphoneMainViewComponent, PartySongQueueItemComponent],
  imports: [CommonModule, PartyRoutingModule, ReactiveFormsModule, SingularityUiModule, TranslocoModule, SharedModule, QRCodeModule, FormsModule],
  providers: [PartyService, PartyParticipantService, PartyParticipantGuard]
})
export class PartyModule {
}

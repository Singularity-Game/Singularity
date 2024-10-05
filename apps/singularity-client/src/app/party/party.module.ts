import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PartyRoutingModule } from "./party-routing.module";
import { CreatePartyComponent } from "./tv-view/create-party/create-party.component";
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SingularityUiModule } from "@singularity/ui";
import { TranslocoModule } from "@ngneat/transloco";
import { PartyService } from "./party.service";
import { PartyLobbyComponent } from "./tv-view/party-lobby/party-lobby.component";
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';
import { PartyParticipantService } from './party-participant.service';
import { JoinPartyComponent } from './smartphone-view/join-party/join-party.component';
import { PartySongSelectComponent } from './smartphone-view/party-song-select/party-song-select.component';
import { PartyParticipantGuard } from './guards/party-participant.guard';
import { JoinPartySetUsernameComponent } from './smartphone-view/join-party/join-party-set-username/join-party-set-username.component';
import { JoinPartySetProfilePictureComponent } from './smartphone-view/join-party/join-party-set-profile-picture/join-party-set-profile-picture.component';
import { JoinPartyReadyComponent } from './smartphone-view/join-party/join-party-ready/join-party-ready.component';

@NgModule({
  declarations: [CreatePartyComponent, PartyLobbyComponent, PartyTVViewComponent, PartySmartphoneViewComponent, JoinPartyComponent, PartySongSelectComponent, JoinPartySetUsernameComponent, JoinPartySetProfilePictureComponent, JoinPartyReadyComponent],
  imports: [CommonModule, PartyRoutingModule, ReactiveFormsModule, SingularityUiModule, TranslocoModule, SharedModule, QRCodeModule, FormsModule],
  providers: [PartyService, PartyParticipantService, PartyParticipantGuard]
})
export class PartyModule {}

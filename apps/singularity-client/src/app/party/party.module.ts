import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PartyRoutingModule } from "./party-routing.module";
import { CreatePartyComponent } from "./tv-view/create-party/create-party.component";
import { ReactiveFormsModule } from "@angular/forms";
import { SingularityUiModule } from "@singularity/ui";
import { TranslocoModule } from "@ngneat/transloco";
import { PartyService } from "./party.service";
import { PartyLobbyComponent } from "./tv-view/party-lobby/party-lobby.component";
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { SharedModule } from '../shared/shared.module';
import { QRCodeModule } from 'angularx-qrcode';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';
import { PartyParticipantService } from './party-participant.service';

@NgModule({
  declarations: [CreatePartyComponent, PartyLobbyComponent, PartyTVViewComponent, PartySmartphoneViewComponent],
  imports: [CommonModule, PartyRoutingModule, ReactiveFormsModule, SingularityUiModule, TranslocoModule, SharedModule, QRCodeModule],
  providers: [PartyService, PartyParticipantService]
})
export class PartyModule {}

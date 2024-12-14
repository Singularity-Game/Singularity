import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { AuthenticationGuard } from '../shared/guards/authentication.guard';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';
import { JoinPartyComponent } from './smartphone-view/join-party/join-party.component';
import { PartyParticipantGuard } from './guards/party-participant.guard';
import {
  PartySmartphoneMainViewComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-main-view.component';
import {
  PartySmartphoneHomeComponent
} from './smartphone-view/party-smartphone-main-view/party-smartphone-home/party-smartphone-home.component';
import { MicrophoneGuard } from '../sing/guards/microphone.guard';
import { AudioContextGuard } from '../sing/guards/audio-context.guard';

const routes: Routes = [
  { path: '', component: PartyTVViewComponent, canActivate: [AuthenticationGuard, MicrophoneGuard(2, 2), AudioContextGuard] },
  {
    path: ':id', component: PartySmartphoneViewComponent, children: [
      {
        path: '', component: PartySmartphoneMainViewComponent, canActivate: [PartyParticipantGuard], children: [
          { path: '', component: PartySmartphoneHomeComponent }
        ]
      },
      { path: 'join', component: JoinPartyComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
}

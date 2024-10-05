import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { AuthenticationGuard } from '../shared/guards/authentication.guard';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';
import { JoinPartyComponent } from './smartphone-view/join-party/join-party.component';
import { PartySongSelectComponent } from './smartphone-view/party-song-select/party-song-select.component';
import { PartyParticipantGuard } from './guards/party-participant.guard';

const routes: Routes = [
  { path: '', component: PartyTVViewComponent, canActivate: [AuthenticationGuard] },
  {
    path: ':id', component: PartySmartphoneViewComponent, children: [
      { path: '', component: PartySongSelectComponent, canActivate: [PartyParticipantGuard] },
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

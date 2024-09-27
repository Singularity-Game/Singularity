import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PartyTVViewComponent } from './tv-view/party-t-v-view.component';
import { AuthenticationGuard } from '../shared/guards/authentication.guard';
import { PartySmartphoneViewComponent } from './smartphone-view/party-smartphone-view.component';

const routes: Routes = [
  { path: '', component: PartyTVViewComponent, canActivate: [AuthenticationGuard], },
  { path: ':id', component: PartySmartphoneViewComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PartyRoutingModule {
}

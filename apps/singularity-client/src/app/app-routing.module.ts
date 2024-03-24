import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AuthenticationGuard } from './shared/guards/authentication.guard';

const routes: Routes = [
  { path: '', redirectTo: 'play', pathMatch: 'full' },
  {
    path: 'sing',
    loadChildren: () => import('./sing/sing.module').then(m => m.SingModule),
    data: { animation: 'sing' }
  },
  {
    path: 'party',
    loadChildren: () => import('./party/party.module').then(m => m.PartyModule),
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'management',
    loadChildren: () => import('./management/management.module').then(m => m.ManagementModule),
    data: { animation: 'management' }
  },
  {
    path: 'play',
    loadChildren: () => import('./play/play.module').then(m => m.PlayModule),
    canActivate: [AuthenticationGuard],
    data: { animation: 'play' }
  },
  {
    path: 'authentication',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule),
    data: { animation: 'authentication' }
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

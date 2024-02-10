import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';
import { NotAuthenticatedGuard } from '../shared/guards/not-authenticated.guard';
import { SetPasswordComponent } from './set-password/set-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';

const routes: Routes = [
  {
    path: '', component: AuthenticationComponent, children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'login', component: LoginComponent, canActivate: [NotAuthenticatedGuard] },
      { path: 'set-password', component: SetPasswordComponent, canActivate: [NotAuthenticatedGuard] },
      { path: 'reset-password', component: ResetPasswordComponent, canActivate: [NotAuthenticatedGuard] }
    ],
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule { }

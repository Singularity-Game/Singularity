import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponent } from './login/login.component';
import { AuthenticationComponent } from './authentication.component';
import { SharedModule } from '../shared/shared.module';
import { TuiCheckboxLabeledModule, TuiInputModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiErrorModule } from '@taiga-ui/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SetPasswordComponent } from './set-password/set-password.component';
import { NoAccountInfoDialogComponent } from './login/no-account-info-dialog/no-account-info-dialog.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { TranslocoModule } from '@ngneat/transloco';

@NgModule({
  declarations: [LoginComponent, AuthenticationComponent, SetPasswordComponent, NoAccountInfoDialogComponent, ResetPasswordComponent],
  imports: [CommonModule, AuthenticationRoutingModule, SharedModule, TuiInputModule, TuiCheckboxLabeledModule, TuiButtonModule, ReactiveFormsModule, TuiErrorModule, TranslocoModule]
})
export class AuthenticationModule {}

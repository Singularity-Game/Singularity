import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LoginRequestForm } from './login-request-form';
import { AuthenticationService } from '../../shared/authentication.service';
import { Router } from '@angular/router';
import { NoAccountInfoDialogComponent } from './no-account-info-dialog/no-account-info-dialog.component';
import { Subject, takeUntil } from 'rxjs';
import { Nullable } from '@singularity/api-interfaces';
import { TranslocoService } from '@ngneat/transloco';
import { ModalService } from '@singularity/ui';

@Component({
  selector: 'singularity-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnDestroy {

  public loginForm = new FormGroup<LoginRequestForm>({
    username: new FormControl<string>('', Validators.required),
    password: new FormControl<string>('', Validators.required)
  });

  public isLoggingIn = false;
  public error: Nullable<string> = null;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly authenticationService: AuthenticationService,
              private readonly router: Router,
              private readonly modalService: ModalService,
              private readonly transloco: TranslocoService) {}

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public login(): void {
    if (this.loginForm.invalid) {
      return;
    }

    const loginRequest = this.loginForm.value;
    if (!loginRequest.username || !loginRequest.password) {
      return;
    }

    this.isLoggingIn = true;

    this.authenticationService.login$(loginRequest.username, loginRequest.password)
      .subscribe((success) => {
        this.isLoggingIn = false;

        if (success) {
          this.router.navigate(['/']);
        } else {
          this.error = this.transloco.translate('authentication.login.wrongUsernameOrPassword');
        }
      });
  }

  public showNoAccountInfoDialog(): void {
    this.modalService.open$(NoAccountInfoDialogComponent, null)
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }

}

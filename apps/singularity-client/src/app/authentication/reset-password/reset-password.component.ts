import { Component, Inject, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordForm } from './reset-password-form';
import { AuthenticationService } from '../../shared/authentication.service';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { Router } from '@angular/router';
import { asyncScheduler, catchError, scheduled, Subject, takeUntil } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnDestroy {
  public readonly resetPasswordForm = new FormGroup<ResetPasswordForm>({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  public isLoading = false;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly authenticationService: AuthenticationService,
              @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
              private readonly router: Router,
              private readonly transloco: TranslocoService) {
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public submit(): void {
    if (this.resetPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;

    this.authenticationService.resetPassword$(this.resetPasswordForm.controls.email.value ?? '')
      .pipe(
        catchError(() => scheduled([false], asyncScheduler)),
        takeUntil(this.destroySubject)
      )
      .subscribe(() => {
        this.alertService.open(this.transloco.translate('authentication.resetPassword.successMessage'),
          {
            label: this.transloco.translate('authentication.resetPassword.successLabel'),
            status: TuiNotification.Success
          })
          .pipe(takeUntil(this.destroySubject))
          .subscribe();

        this.isLoading = false;

        this.router.navigate(['/', 'authentication', 'login']);
      });
  }
}

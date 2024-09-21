import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ResetPasswordForm } from './reset-password-form';
import { AuthenticationService } from '../../shared/authentication.service';
import { Router } from '@angular/router';
import { asyncScheduler, catchError, scheduled, Subject, takeUntil } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from '@singularity/ui';

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
              private readonly toastService: ToastService,
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
        this.toastService.show(this.transloco.translate('authentication.resetPassword.successLabel'), this.transloco.translate('authentication.resetPassword.successMessage'), 'success');

        this.isLoading = false;

        this.router.navigate(['/', 'authentication', 'login']);
      });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetPasswordForm } from './set-password-form';
import { AuthenticationService } from '../../shared/authentication.service';
import { Nullable } from '@singularity/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { TuiAlertService, TuiNotification } from '@taiga-ui/core';
import { asyncScheduler, catchError, scheduled, Subject, takeUntil } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.scss']
})
export class SetPasswordComponent implements OnInit, OnDestroy {
  public setPasswordForm = new FormGroup<SetPasswordForm>({
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  public token: Nullable<string> = null;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly authenticationService: AuthenticationService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly router: Router,
              private readonly alertService: TuiAlertService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnInit(): void {
    this.token = this.activatedRoute.snapshot.queryParamMap.get('token');
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public submit(): void {
    if (this.setPasswordForm.controls.password.value !== this.setPasswordForm.controls.repeatPassword.value || this.setPasswordForm.invalid) {
      return;
    }

    this.authenticationService.setPassword$(this.setPasswordForm.controls.password.value ?? '', this.token ?? '')
      .pipe(
        catchError(() => scheduled([false], asyncScheduler)),
        takeUntil(this.destroySubject)
      )
      .subscribe((success: boolean) => {
        if (success) {
          this.alertService.open(this.transloco.translate('authentication.setPassword.successMessage'), {
            label: this.transloco.translate('authentication.setPassword.successLabel'),
            status: TuiNotification.Success
          })
            .pipe(takeUntil(this.destroySubject))
            .subscribe();
          this.router.navigate(['/', 'authentication', 'login']);
        } else {
          this.alertService.open(this.transloco.translate('authentication.setPassword.errorMessage'), {
            label: this.transloco.translate('authentication.setPassword.errorLabel'),
            status: TuiNotification.Error
          })
            .pipe(takeUntil(this.destroySubject))
            .subscribe();
        }
      });
  }
}

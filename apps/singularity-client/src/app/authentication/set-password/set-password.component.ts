import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SetPasswordForm } from './set-password-form';
import { AuthenticationService } from '../../shared/authentication.service';
import { Nullable } from '@singularity/api-interfaces';
import { ActivatedRoute, Router } from '@angular/router';
import { asyncScheduler, catchError, scheduled, Subject, takeUntil } from 'rxjs';
import { TranslocoService } from '@ngneat/transloco';
import { ToastService } from '@singularity/ui';

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
              private readonly toastService: ToastService,
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
          this.toastService.show(this.transloco.translate('authentication.setPassword.successLabel'), this.transloco.translate('authentication.setPassword.successMessage'), 'success')
          this.router.navigate(['/', 'authentication', 'login']);
        } else {
          this.toastService.show(this.transloco.translate('authentication.setPassword.errorLabel'), this.transloco.translate('authentication.setPassword.errorMessage'), 'error')
        }
      });
  }
}

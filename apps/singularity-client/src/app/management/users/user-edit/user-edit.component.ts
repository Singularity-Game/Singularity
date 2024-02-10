import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditUserForm } from './edit-user-form';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { Nullable, UserDto } from '@singularity/api-interfaces';
import { catchError, filter, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { TuiAlertService, TuiDialogService, tuiLoaderOptionsProvider, TuiNotification } from '@taiga-ui/core';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { AuthenticationService } from '../../../shared/authentication.service';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css'],
  providers: [
    tuiLoaderOptionsProvider({
      size: 'l',
      inheritColor: false,
      overlay: true
    })
  ]
})
export class UserEditComponent implements OnInit, OnDestroy {
  public userForm = new FormGroup<EditUserForm>({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    profilePictureBase64: new FormControl(''),
    active: new FormControl(false),
    isAdmin: new FormControl(false)
  });

  public isEditMode = false;
  public userId: Nullable<number> = null;
  public isLoading = false;

  public user?: UserDto;

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly activatedRoute: ActivatedRoute,
              private readonly userService: UserService,
              private readonly router: Router,
              private readonly authenticationService: AuthenticationService,
              private readonly dialogService: TuiDialogService,
              @Inject(TuiAlertService) private readonly alertService: TuiAlertService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnInit(): void {
    this.userId = +(this.activatedRoute.snapshot.paramMap.get('id') ?? -1);
    this.isEditMode = this.userId > -1;

    if (!this.isEditMode) {
      // When a new user is created, they will be inactive by default, until they set a password.
      this.userForm.controls.active.disable();
    } else {
      this.isLoading = true;
      this.userService.getUserById$(this.userId ?? -1)
        .pipe(takeUntil(this.destroySubject))
        .subscribe((user: UserDto) => {
          this.isLoading = false;
          this.userForm.patchValue(user);
          this.user = user;
        });
    }
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public resetPassword(): void {
    if (!this.user) {
      return;
    }

    const prompt: TuiPromptData = {
      content: this.transloco.translate('management.users.editUser.resetPasswordPrompt'),
      yes: this.transloco.translate('general.yes'),
      no: this.transloco.translate('general.no')
    };

    this.dialogService.open<boolean>(TUI_PROMPT, {
      label: this.transloco.translate('management.users.editUser.resetPassword'),
      size: 's',
      data: prompt
    }).pipe(
      filter((value) => value),
      switchMap(() => this.authenticationService.resetPassword$(this.user?.email ?? '')),
      catchError(() => {
        this.handleError(this.transloco.translate('management.users.editUser.error'), this.transloco.translate('general.error'));
        return throwError(() => 'Error');
      }),
      takeUntil(this.destroySubject)
    ).subscribe(() => {
      this.handleSuccess(this.transloco.translate('management.users.editUser.resetPasswordSuccessMessage'), this.transloco.translate('management.users.editUser.resetPasswordSuccessLabel'));
    });
  }

  public save(): void {
    if (!this.userForm.valid) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      if (!this.userId) {
        return;
      }
      this.userService.updateUser$(this.userId, {
        id: this.userId,
        username: this.userForm.controls.username.value ?? '',
        email: this.userForm.controls.email.value ?? '',
        profilePictureBase64: this.userForm.controls.profilePictureBase64.value ?? '',
        active: this.userForm.controls.active.value ?? true,
        isAdmin: this.userForm.controls.isAdmin.value ?? false
      }).pipe(
        catchError(() => {
          this.handleError(this.transloco.translate('management.users.editUser.error'), this.transloco.translate('general.error'));
          return throwError(() => 'Error');
        }),
        takeUntil(this.destroySubject)
      ).subscribe(() => {
        this.handleSuccess(this.transloco.translate('management.users.editUser.editUserSuccessMessage'), this.transloco.translate('management.users.editUser.editUserSuccessLabel'));
        this.isLoading = false;
        this.router.navigate(['management', 'users']);
      });
    } else {
      this.userService.createUser$(
        this.userForm.controls.username.value ?? '',
        this.userForm.controls.email.value ?? '',
        this.userForm.controls.profilePictureBase64.value ?? '',
        this.userForm.controls.isAdmin.value ?? false
      ).pipe(
        catchError(() => {
          this.handleError(this.transloco.translate('management.users.editUser.error'), this.transloco.translate('general.error'));
          return throwError(() => 'Error');
        }),
        takeUntil(this.destroySubject)
      ).subscribe(() => {
        this.handleSuccess(this.transloco.translate('management.users.editUser.createUserSuccessMessage'), this.transloco.translate('management.users.editUser.createUserSuccessLabel'));
        this.isLoading = false;
        this.router.navigate(['management', 'users']);
      });
    }
  }

  private handleError(message: string, label: string): void {
    this.alertService.open(message, { label: label, status: TuiNotification.Error })
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }

  private handleSuccess(message: string, label: string): void {
    this.alertService.open(message, { label: label, status: TuiNotification.Success })
      .pipe(takeUntil(this.destroySubject))
      .subscribe();
  }
}

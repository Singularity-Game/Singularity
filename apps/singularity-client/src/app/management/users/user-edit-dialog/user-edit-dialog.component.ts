import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EditUserForm } from './edit-user-form';
import { catchError, filter, Subject, switchMap, takeUntil, tap, throwError } from 'rxjs';
import { Nullable, UserDto } from '@singularity/api-interfaces';
import { UserService } from '../user.service';
import { ModalContext, ModalService } from '@singularity/ui';
import { TranslocoService } from '@ngneat/transloco';
import { PromptDialogComponent } from '../../../shared/components/prompt-dialog/prompt-dialog.component';
import { AuthenticationService } from '../../../shared/authentication.service';

@Component({
  selector: 'singularity-user-edit-dialog',
  templateUrl: './user-edit-dialog.component.html',
  styleUrl: './user-edit-dialog.component.scss'
})
export class UserEditDialogComponent implements OnInit, OnDestroy {
  public userForm = new FormGroup<EditUserForm>({
    username: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    profilePictureBase64: new FormControl(''),
    active: new FormControl(false),
    isAdmin: new FormControl(false)
  });

  public isEditMode = false;
  public isLoading = false;
  public errorMessage = '';

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly userService: UserService,
              private readonly transloco: TranslocoService,
              private readonly modalService: ModalService,
              private readonly authenticationService: AuthenticationService,
              private readonly modalContext: ModalContext<Nullable<UserDto>, Nullable<UserDto>>) {
  }

  public ngOnInit(): void {
    this.isEditMode = !!this.modalContext.data;

    console.log(this.isEditMode, this.modalContext);

    if (!this.isEditMode) {
      // When a new user is created, they will be inactive by default, until they set a password.
      this.userForm.controls.active.disable();
    } else {
      this.userForm.patchValue(this.modalContext.data!);
    }
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public resetPassword(): void {
    if (!this.modalContext.data) {
      return;
    }

    this.isLoading = true;

    this.modalService.open$<boolean, string>(PromptDialogComponent, this.transloco.translate('management.users.editUser.resetPasswordPrompt'))
      .pipe(
        tap((value) => {
          if (!value) {
            this.isLoading = false;
          }
        }),
        filter((value) => !!value),
        switchMap(() => this.authenticationService.resetPassword$(this.modalContext.data?.email ?? '')),
        catchError(() => {
          this.errorMessage = this.transloco.translate('management.users.editUser.error');
          this.isLoading = false;
          return throwError(() => 'Error');
        }),
        takeUntil(this.destroySubject)
      )
      .subscribe(() => {
        this.isLoading = false;
      });
  }

  public save(): void {
    if (!this.userForm.valid) {
      return;
    }

    this.isLoading = true;

    if (this.isEditMode) {
      if (!this.modalContext.data) {
        return;
      }
      this.userService.updateUser$(this.modalContext.data.id, {
        id: this.modalContext.data.id,
        username: this.userForm.controls.username.value ?? '',
        email: this.userForm.controls.email.value ?? '',
        profilePictureBase64: this.userForm.controls.profilePictureBase64.value ?? '',
        active: this.userForm.controls.active.value ?? true,
        isAdmin: this.userForm.controls.isAdmin.value ?? false
      }).pipe(
        catchError(() => {
          this.errorMessage = this.transloco.translate('management.users.editUser.error');
          this.isLoading = false;
          return throwError(() => 'Error');
        }),
        takeUntil(this.destroySubject)
      ).subscribe((user: UserDto) => {
        this.isLoading = false;
        this.modalContext.close(user);
      });
    } else {
      this.userService.createUser$(
        this.userForm.controls.username.value ?? '',
        this.userForm.controls.email.value ?? '',
        this.userForm.controls.profilePictureBase64.value ?? '',
        this.userForm.controls.isAdmin.value ?? false
      ).pipe(
        catchError(() => {
          this.errorMessage = this.transloco.translate('management.users.editUser.error');
          this.isLoading = false;
          return throwError(() => 'Error');
        }),
        takeUntil(this.destroySubject)
      ).subscribe((user: UserDto) => {
        this.isLoading = false;
        this.modalContext.close(user);
      });
    }
  }

  public cancel(): void {
    this.modalContext.close(null);
  }
}

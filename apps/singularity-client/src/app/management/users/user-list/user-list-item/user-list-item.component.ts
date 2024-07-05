import { Component, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { UserDto } from '@singularity/api-interfaces';
import { TUI_PROMPT, TuiPromptData } from '@taiga-ui/kit';
import { TuiAlertService, TuiDialogService, TuiNotification } from '@taiga-ui/core';
import { catchError, filter, Subject, switchMap, takeUntil, throwError } from 'rxjs';
import { UserService } from '../../user.service';
import { TranslocoService } from '@ngneat/transloco';
import { ModalService } from '@singularity/ui';
import { UserEditDialogComponent } from '../../user-edit-dialog/user-edit-dialog.component';

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'tr[singularity-user-list-item]',
  templateUrl: './user-list-item.component.html',
  styleUrls: ['./user-list-item.component.css']
})
export class UserListItemComponent implements OnDestroy {
  @Input() user?: UserDto;

  @Output() deleted = new EventEmitter<void>();

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly dialogService: TuiDialogService,
              private readonly alertService: TuiAlertService,
              private readonly userService: UserService,
              private readonly modalService: ModalService,
              private readonly transloco: TranslocoService) {
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public editUser(): void {
    if(!this.user) {
      return;
    }

    this.modalService.open$<UserDto, UserDto>(UserEditDialogComponent, this.user)
      .subscribe();
  }

  public deleteUser(): void {
    const prompt: TuiPromptData = {
      content: `${this.transloco.translate('management.users.userListItem.deleteUserPrompt1')} <code>${this.user?.username}</code> ${this.transloco.translate('management.users.userListItem.deleteUserPrompt1')}`,
      yes: this.transloco.translate('general.yes'),
      no: this.transloco.translate('general.no')
    };

    this.dialogService.open<boolean>(TUI_PROMPT, {
      label: this.transloco.translate('management.users.userListItem.deleteUserPromptLabel'),
      size: 's',
      data: prompt
    }).pipe(
      filter((value) => value),
      switchMap(() => this.userService.deleteUser$(this.user?.id ?? -1)),
      catchError(() => {
        this.handleError(this.transloco.translate('management.users.userListItem.error'), this.transloco.translate('general.error'));
        return throwError(() => 'Error');
      }),
      takeUntil(this.destroySubject)
    ).subscribe(() => {
      this.handleSuccess(this.transloco.translate('management.users.userListItem.deleteUserSuccessMessage'), this.transloco.translate('management.users.userListItem.deleteUserSuccessLabel'))
      this.deleted.emit();
    });
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

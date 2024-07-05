import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subject, takeUntil } from 'rxjs';
import { UserDto } from '@singularity/api-interfaces';
import { UserService } from '../user.service';
import { ModalService } from '@singularity/ui';
import { UserEditDialogComponent } from '../user-edit-dialog/user-edit-dialog.component';

@Component({
  selector: 'singularity-users',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit, OnDestroy {
  public users$ = new BehaviorSubject<UserDto[]>([]);

  private readonly destroySubject = new Subject<void>();

  constructor(private readonly userService: UserService,
              private readonly modalService: ModalService) {
  }

  public ngOnInit(): void {
    this.userService.getAllUsers$()
      .pipe(takeUntil(this.destroySubject))
      .subscribe((users: UserDto[]) => this.users$.next(users));
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public deleteUser(user: UserDto): void {
    const newUsers = this.users$.getValue().filter(existingUser => existingUser.id !== user.id);
    this.users$.next(newUsers);
  }

  public createUser(): void {
    this.modalService.open$<UserDto, null>(UserEditDialogComponent, null)
      .subscribe();
  }
}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UserListComponent } from './user-list/user-list.component';
import { UserListItemComponent } from './user-list/user-list-item/user-list-item.component';
import { TuiAvatarModule, TuiCheckboxLabeledModule, TuiInputModule, TuiIslandModule } from '@taiga-ui/kit';
import { TuiButtonModule, TuiHintModule, TuiLoaderModule, TuiSvgModule } from '@taiga-ui/core';
import { UserEditComponent } from './user-edit/user-edit.component';
import { SharedModule } from '../../shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslocoModule } from '@ngneat/transloco';


@NgModule({
  declarations: [
    UserListComponent,
    UserListItemComponent,
    UserEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    TuiAvatarModule,
    TuiSvgModule,
    TuiHintModule,
    TuiButtonModule,
    SharedModule,
    TuiInputModule,
    TuiIslandModule,
    TuiCheckboxLabeledModule,
    ReactiveFormsModule,
    TuiLoaderModule,
    TranslocoModule
  ]
})
export class UsersModule { }

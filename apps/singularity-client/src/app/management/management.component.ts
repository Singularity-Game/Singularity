import { Component, inject } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';

@Component({
  selector: 'singularity-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
  standalone: false,
})
export class ManagementComponent  {
  private readonly authenticationService = inject(AuthenticationService);

  public readonly isAdmin = this.authenticationService.isAdmin;
}

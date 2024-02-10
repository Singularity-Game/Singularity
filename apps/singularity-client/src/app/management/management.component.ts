import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../shared/authentication.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'singularity-management',
  templateUrl: './management.component.html',
  styleUrls: ['./management.component.scss'],
})
export class ManagementComponent implements OnInit {
  public isAdmin$?: Observable<boolean>;

  constructor(private readonly authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.isAdmin$ = this.authenticationService.isAdmin$();
  }
}

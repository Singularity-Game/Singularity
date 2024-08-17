import { Component, Input, isDevMode, OnInit } from '@angular/core';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Nullable, UserDto } from '@singularity/api-interfaces';
import { environment } from '../../../../environments/environment';
import { ToastService } from '@singularity/ui';

@Component({
  selector: 'singularity-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() transparent = false;

  public user$?: Observable<Nullable<UserDto>>;

  public partyEnabled = environment.partyEnabled;
  public devMode = isDevMode();

  constructor(private readonly authenticationService: AuthenticationService,
              private readonly router: Router,
              private readonly toastService: ToastService) {
  }

  public ngOnInit(): void {
    this.user$ = this.authenticationService.getLocalUser$();
  }

  public logout(): void {
    this.authenticationService.logout();
    this.router.navigate(['/', 'authentication', 'login'])
  }

  public toast(): void {
    this.toastService.show('test', 'test', 'info');
  }

}

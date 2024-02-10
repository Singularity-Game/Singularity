import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../authentication.service';

@Injectable({ providedIn: 'root' })
export class NotAuthenticatedGuard implements CanActivate {
  constructor(private readonly authenticationService: AuthenticationService,
              private readonly router: Router) {
  }
  canActivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (!this.authenticationService.isAuthenticated()) {
      return true;
    } else {
      return this.router.createUrlTree(['/']);
    }
  }

}

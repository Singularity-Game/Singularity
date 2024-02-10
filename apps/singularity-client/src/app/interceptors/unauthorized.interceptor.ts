import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/authentication.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {

  constructor(private readonly router: Router,
              private readonly authenticationService: AuthenticationService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(request)
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          this.authenticationService.logout();
          this.router.navigate(['authentication', 'login']);
        }
        return throwError(() => error);
      }));
  }
}

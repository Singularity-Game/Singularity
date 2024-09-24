import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, BehaviorSubject, catchError, map, Observable, scheduled, shareReplay, tap } from 'rxjs';
import { Md5 } from 'ts-md5';
import { Nullable, UserDto } from '@singularity/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private user$ = this.http.get<UserDto>('/api/user/me').pipe(shareReplay(1));
  private authenticated = true;

  constructor(private readonly http: HttpClient) { }

  public login$(username: string, password: string): Observable<boolean> {
    return this.http.post('/api/user/login', {
      username: username,
      password: Md5.hashStr(password)
    })
      .pipe(
        map(() => true),
        catchError(() => scheduled([false], asyncScheduler)),
        tap((success: boolean) => this.authenticated = success)
      )
  }

  public setPassword$(password: string, token: string): Observable<boolean> {
    return this.http.post<UserDto>('/api/user/setpassword', {
      password: Md5.hashStr(password),
      token: token
    })
      .pipe(
        map(() => true),
        catchError(() => scheduled([false], asyncScheduler))
      );
  }

  public resetPassword$(email: string): Observable<void> {
    return this.http.post<void>('/api/user/resetpassword', {
      email: email
    });
  }

  public logout() {
    this.authenticated = false;
  }

  public isAuthenticated(): boolean {
    return this.authenticated;
  }

  public getLocalUser$(): Observable<Nullable<UserDto>> {
    return this.user$;
  }

  public isAdmin$(): Observable<boolean> {
    return this.getLocalUser$()
      .pipe(
        map((user: Nullable<UserDto>) => {
          if (user === null) {
            return false;
          }

          return user.isAdmin;
        })
      )
  }
}

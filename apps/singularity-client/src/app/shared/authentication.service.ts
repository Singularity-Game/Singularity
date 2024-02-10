import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, BehaviorSubject, catchError, map, Observable, scheduled, tap } from 'rxjs';
import { Md5 } from 'ts-md5';
import { AccessToken, Nullable, UserDto } from '@singularity/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private userSubject = new BehaviorSubject<Nullable<UserDto>>(this.getUser());

  constructor(private readonly http: HttpClient) { }

  public login$(username: string, password: string): Observable<boolean> {
    return this.http.post<AccessToken>('/api/user/login', {
      username: username,
      password: Md5.hashStr(password)
    })
      .pipe(
        tap((token: AccessToken) => {
          localStorage.setItem('access-token', token.accessToken);
          this.userSubject.next(this.parseJwt<{user: UserDto}>(token.accessToken)?.user ?? null);
        }),
        map(() => true),
        catchError(() => scheduled([false], asyncScheduler))
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
    localStorage.removeItem('access-token');
    this.userSubject.next(null);
  }

  public isAuthenticated(): boolean {
    return Boolean(this.getAccessToken());
  }

  public getAccessToken(): string | null {
    return localStorage.getItem('access-token');
  }

  public getLocalUser$(): Observable<Nullable<UserDto>> {
    return this.userSubject.asObservable();
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

  private parseJwt<T>(token: string): T | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return `%${(`00${c.charCodeAt(0).toString(16)}`).slice(-2)}`;
      }).join(''));

      return JSON.parse(jsonPayload);
    } catch {
      return null;
    }
  }

  private getUser(): Nullable<UserDto> {
    return this.parseJwt<{user: UserDto}>(this.getAccessToken() ?? '')?.user ?? null;
  }
}

import { computed, inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { asyncScheduler, catchError, map, Observable, of, scheduled, Subject, tap, throwError } from 'rxjs';
import { Md5 } from 'ts-md5';
import { Nullable, UserDto } from '@singularity/api-interfaces';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly http = inject(HttpClient);

  public readonly user = signal<Nullable<UserDto>>(null);

  public readonly isAdmin = computed(() => {
    const user = this.user();
    return user?.isAdmin ?? false;
  });

  public readonly isAuthenticated = computed(() => {
    const user = this.user();
    return !!user;
  })

  public login$(username: string, password: string): Observable<Nullable<UserDto>> {
    return this.http.post<UserDto>('/api/user/login', {
      username: username,
      password: Md5.hashStr(password)
    })
      .pipe(
        catchError(() => of(null)),
        tap((user: Nullable<UserDto>) => this.user.set(user))
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

  public logout$(): Observable<boolean> {
    return this.http.post<void>('/api/user/logout', {})
      .pipe(
        tap(() => this.user.set(null)),
        map(() => true),
        catchError(() => throwError(() => false))
      )
  }
}

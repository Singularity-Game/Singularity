import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpHeaders, HttpRequest } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { AuthenticationService } from './authentication.service';
import { LoadProgress } from './types/load-progress';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient,
              private readonly authenticationService: AuthenticationService) {
  }

  get$<T>(url: string): Observable<T> {
    return this.http.get<T>(url, {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
      }
    });
  }

  getFile$(url: string): Observable<LoadProgress<Blob>> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
    });

    const request = new HttpRequest('GET', url, {
      responseType: 'blob',
      reportProgress: true,
      headers: headers
    });

    return this.http.request<Blob>(request).pipe(
      filter((event: HttpEvent<Blob>) => {
        return event.type === HttpEventType.DownloadProgress ||
          event.type === HttpEventType.UploadProgress ||
          event.type === HttpEventType.Response;
      }),
      map((event: HttpEvent<Blob>) => {
        switch (event.type) {
          case HttpEventType.DownloadProgress:
          case HttpEventType.UploadProgress:
            // eslint-disable-next-line no-case-declarations
            const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
            return new LoadProgress<Blob>(percentDone);
          case HttpEventType.Response:
            return new LoadProgress<Blob>(100, event.body);
          default:
            throw new Error('Unexpected HTTP Event received!');
        }
      })
    );
  }

  post$<T>(url: string, body: object, reportProgress: true): Observable<LoadProgress<T>>;
  post$<T>(url: string, body: object, reportProgress?: false): Observable<T>;
  post$<T>(url: string, body: object, reportProgress: boolean = false): Observable<T> | Observable<LoadProgress<T>> {
    if (!reportProgress) {
      return this.http.post<T>(url, body, {
        headers: {
          'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
        }
      });
    } else {
      return this.http.post<T>(url, body, {
        headers: {
          'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
        },
        reportProgress: true,
        observe: 'events'
      }).pipe(
        filter((event: HttpEvent<T>) => {
          return event.type === HttpEventType.DownloadProgress ||
            event.type === HttpEventType.UploadProgress ||
            event.type === HttpEventType.Response;
        }),
        map((event: HttpEvent<T>) => {
          switch (event.type) {
            case HttpEventType.DownloadProgress:
            case HttpEventType.UploadProgress:
              // eslint-disable-next-line no-case-declarations
              const percentDone = event.total ? Math.round(100 * event.loaded / event.total) : 0;
              return new LoadProgress<T>(percentDone);
            case HttpEventType.Response:
              return new LoadProgress<T>(100, event.body);
            default:
              throw new Error('Unexpected HTTP Event received!');
          }
        }));
    }

  }

  put$<T>(url: string, body: object): Observable<T> {
    return this.http.put<T>(url, body, {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
      }
    });
  }

  delete$<T>(url: string): Observable<T> {
    return this.http.delete<T>(url, {
      headers: {
        'Authorization': `Bearer ${this.authenticationService.getAccessToken()}`
      }
    });
  }
}

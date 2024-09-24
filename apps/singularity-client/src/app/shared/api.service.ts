import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpRequest } from '@angular/common/http';
import { filter, map, Observable } from 'rxjs';
import { LoadProgress } from './types/load-progress';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private readonly http: HttpClient) {
  }

  get$<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  getFile$(url: string): Observable<LoadProgress<Blob>> {
    const request = new HttpRequest('GET', url, {
      responseType: 'blob',
      reportProgress: true,
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
      return this.http.post<T>(url, body, );
    } else {
      return this.http.post<T>(url, body, {
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
    return this.http.put<T>(url, body);
  }

  delete$<T>(url: string): Observable<T> {
    return this.http.delete<T>(url);
  }
}

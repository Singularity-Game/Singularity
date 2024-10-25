import { Injectable, NgZone } from '@angular/core';
import { finalize, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SseService {
  constructor(private readonly zone: NgZone) {
  }

  public getMessages$<Result>(url: string): Observable<Result> {

    const source = new EventSource(url);
    const subject = new Subject<Result>();

    source.onmessage = (event: MessageEvent<string>) => {
      // Angular does not detect changes, when a ServerSentEvent is received.
      // We need to use zone.run, so that Angular detects the changes.
      this.zone.run(() => subject.next(JSON.parse(event.data)));
    }

    return subject.asObservable()
      .pipe(
        finalize(() => source.close())
      );
  }
}

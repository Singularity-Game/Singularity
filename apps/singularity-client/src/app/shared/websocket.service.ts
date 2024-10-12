import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { finalize, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private readonly ios: Record<string, Socket> = {};

  private getIo(namespace: string): Socket {
    if(!this.ios[namespace]) {
      this.ios[namespace] = io(namespace);
    }
    this.ios[namespace].connect();
    return this.ios[namespace];
  }

  public getMessages$<Result, Value>(namespace: string, event: string, payload?: Value): Observable<Result> {
    const io = this.getIo(namespace);
    const subject = new Subject<Result>();

    io.emit(event, payload);
    io.on(event, (value: Result) => {
      subject.next(value);
    });
    io.on('disconnect', () => {
      subject.complete();
    });

    return subject.asObservable()
      .pipe(
        finalize(() => io.close())
      );
  }
}

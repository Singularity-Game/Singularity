import { Injectable } from '@angular/core';
import {
  auditTime,
  buffer,
  bufferTime,
  distinctUntilChanged,
  Observable,
  startWith,
  Subject,
  tap,
  timeInterval
} from 'rxjs';
import { Toast } from './toast';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastTime = 10000;
  private toastSubject = new Subject<Toast[]>()
  private toasts: Toast[] = [];

  public getToasts$(): Observable<Toast[]> {
    return this.toastSubject.asObservable();
  }

  public show(header: string, message: string, type: 'success' | 'warning' | 'error' | 'info'): void {
    const toast: Toast = { header: header, message: message, type: type }

    this.toasts.push(toast);
    this.toastSubject.next(this.toasts);

    setTimeout(() => {
      const index = this.toasts.indexOf(toast);
      this.toasts.splice(index, 1);
      this.toastSubject.next(this.toasts);
    }, this.toastTime);
  }
}

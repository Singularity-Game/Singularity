import { Component, Input } from '@angular/core';

@Component({
  selector: 'sui-toast',
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss'
})
export class ToastComponent {
  @Input() title = '';
  @Input() message = '';
  @Input() type: 'success' | 'warning' | 'error' | 'info' = 'info';
  @Input() i: number = 0;
}

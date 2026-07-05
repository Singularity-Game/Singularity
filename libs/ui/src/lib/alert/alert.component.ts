import { Component, Input } from '@angular/core';

@Component({
    selector: 'sui-alert',
    templateUrl: './alert.component.html',
    styleUrl: './alert.component.scss',
    standalone: false
})
export class AlertComponent {
  @Input() type: 'error' | 'info' | 'warning' | 'success' = 'error';
  @Input() message = '';
}

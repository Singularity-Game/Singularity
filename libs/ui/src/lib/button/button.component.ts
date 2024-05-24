import { Component, Input } from '@angular/core';

@Component({
  selector: '[suiButton]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() size: 'xs' | 's' | 'l' = 'l';
  @Input() isIcon = false;
  @Input() appearance: 'success' | 'warn' | 'error' | 'default' = 'default';
  @Input() loading = false;
}

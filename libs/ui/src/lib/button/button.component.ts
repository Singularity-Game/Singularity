import { Component, Input } from '@angular/core';

@Component({
  selector: '[sui-button]',
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss'
})
export class ButtonComponent {
  @Input() size: 's' | 'l' = 'l';
}

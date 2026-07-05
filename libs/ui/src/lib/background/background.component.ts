import { Component, Input } from '@angular/core';

@Component({
    selector: 'sui-background',
    templateUrl: './background.component.html',
    styleUrl: './background.component.scss',
    standalone: false
})
export class BackgroundComponent {
  @Input() type: 'grid' | 'grid-small' | 'dots' = 'grid';
}

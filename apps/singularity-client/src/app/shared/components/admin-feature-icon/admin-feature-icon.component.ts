import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'singularity-admin-feature-icon',
  templateUrl: './admin-feature-icon.component.html',
  styleUrls: ['./admin-feature-icon.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class AdminFeatureIconComponent {
  @Input() size: 'small' | 'large' = 'small';
}

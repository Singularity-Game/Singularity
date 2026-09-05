import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'singularity-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class SidebarComponent {
}

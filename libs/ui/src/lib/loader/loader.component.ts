import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'sui-loader',
  templateUrl: './loader.component.html',
  styleUrl: './loader.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class LoaderComponent {

}

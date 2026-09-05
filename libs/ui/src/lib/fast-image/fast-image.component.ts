import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
// @ts-ignore
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'sui-fast-image',
  templateUrl: './fast-image.component.html',
  styleUrl: './fast-image.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class FastImageComponent {
  @Input() src?: Nullable<string> = '';
  @Input() blurrySrc?: Nullable<string> = '';
  @Input() alt?: Nullable<string> = '';
  @Input() width?: Nullable<string>;
  @Input() height?: Nullable<string>;

  public imageLoaded = false;
}

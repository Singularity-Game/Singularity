import { Component, Input } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'sui-fast-image',
  templateUrl: './fast-image.component.html',
  styleUrl: './fast-image.component.scss'
})
export class FastImageComponent {
  @Input() src?: Nullable<string> = '';
  @Input() blurrySrc?: Nullable<string> = '';
  @Input() alt?: Nullable<string> = '';
  @Input() width?: Nullable<number>;
  @Input() height?: Nullable<number>;

  public imageLoaded = false;
}

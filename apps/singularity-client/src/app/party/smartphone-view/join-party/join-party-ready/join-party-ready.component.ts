import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-join-party-ready',
  templateUrl: './join-party-ready.component.html',
  styleUrl: './join-party-ready.component.scss',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.Eager
})
export class JoinPartyReadyComponent {

  @Input() userName?: Nullable<string>;
  @Input() profilePictureBase64?: Nullable<string>;

  @Output() join = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

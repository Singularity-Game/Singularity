import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'singularity-join-party-ready',
  templateUrl: './join-party-ready.component.html',
  styleUrl: './join-party-ready.component.scss'
})
export class JoinPartyReadyComponent {

  @Input() userName?: string;
  @Input() profilePictureBase64?: string;

  @Output() join = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();
}

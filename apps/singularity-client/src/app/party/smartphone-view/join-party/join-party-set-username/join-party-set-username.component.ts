import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Nullable, PartyDto } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-join-party-set-username',
  templateUrl: './join-party-set-username.component.html',
  styleUrl: './join-party-set-username.component.scss'
})
export class JoinPartySetUsernameComponent {
  @Input() party?: Nullable<PartyDto>;
  @Output() username = new EventEmitter<string>();

  public text = '';

  public next(): void {
    if(!this.text) {
      return;
    }

    this.username.emit(this.text);
  }
}

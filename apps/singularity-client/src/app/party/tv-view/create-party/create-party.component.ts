import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePartyForm } from './create-party-form';
import { Nullable, PartyDto } from '@singularity/api-interfaces';
import { PartyService } from '../../party.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'singularity-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.scss']
})
export class CreatePartyComponent implements OnDestroy {
  @Output() party = new EventEmitter<PartyDto>();

  public form = new FormGroup<CreatePartyForm>({
    name: new FormControl<Nullable<string>>('', Validators.required)
  });

  public loading = false;

  private destroySubject = new Subject<void>();

  constructor(private readonly partyService: PartyService) {
  }

  public ngOnDestroy(): void {
    this.destroySubject.next();
    this.destroySubject.complete();
  }

  public createParty() {
    if(this.form.invalid) {
      return;
    }

    this.loading = true;

    this.partyService.createParty$(this.form.value.name ?? '')
      .pipe(takeUntil(this.destroySubject))
      .subscribe((result) => {
        this.party.emit(result);
      })
  }
}

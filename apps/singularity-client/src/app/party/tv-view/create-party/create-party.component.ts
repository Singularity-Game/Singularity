import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePartyForm } from './create-party-form';
import { Nullable } from '@singularity/api-interfaces';
import { PartyService } from '../../party.service';

@Component({
  selector: 'singularity-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.scss']
})
export class CreatePartyComponent {
  public form = new FormGroup<CreatePartyForm>({
    name: new FormControl<Nullable<string>>('', Validators.required)
  });

  public loading = false;

  constructor(private readonly partyService: PartyService) {
  }

  public createParty() {
    if(this.form.invalid) {
      return;
    }

    this.loading = true;

    this.partyService.createParty$(this.form.value.name ?? '')
      .subscribe((result) => {
        console.log(result);
      })
  }
}

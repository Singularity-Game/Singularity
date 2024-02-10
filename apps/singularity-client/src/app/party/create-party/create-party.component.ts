import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { CreatePartyForm } from './create-party-form';
import { Nullable } from '@singularity/api-interfaces';

@Component({
  selector: 'singularity-create-party',
  templateUrl: './create-party.component.html',
  styleUrls: ['./create-party.component.scss']
})
export class CreatePartyComponent {
  public form = new FormGroup<CreatePartyForm>({
    name: new FormControl<Nullable<string>>('', Validators.required)
  })
}

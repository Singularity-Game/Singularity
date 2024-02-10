import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface CreatePartyForm {
  name: FormControl<Nullable<string>>;
}

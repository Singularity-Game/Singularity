import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface LoginRequestForm {
  username: FormControl<Nullable<string>>;
  password: FormControl<Nullable<string>>;
}

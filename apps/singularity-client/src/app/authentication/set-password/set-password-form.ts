import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface SetPasswordForm {
  password: FormControl<Nullable<string>>;
  repeatPassword: FormControl<Nullable<string>>;
}

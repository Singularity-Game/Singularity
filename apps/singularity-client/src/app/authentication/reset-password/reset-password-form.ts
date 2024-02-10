import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface ResetPasswordForm {
  email: FormControl<Nullable<string>>;
}

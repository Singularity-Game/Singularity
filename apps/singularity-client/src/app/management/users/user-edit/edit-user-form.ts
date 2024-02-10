import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface EditUserForm {
  username: FormControl<Nullable<string>>;
  email: FormControl<Nullable<string>>;
  profilePictureBase64: FormControl<Nullable<string>>;
  isAdmin: FormControl<Nullable<boolean>>;
  active: FormControl<Nullable<boolean>>;
  password?: FormControl<Nullable<string>>;
  repeatPassword?: FormControl<Nullable<string>>;

}

import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';

export interface CreateSongForm {
  txtFile: FormControl<Nullable<File>>;
  audioFile: FormControl<Nullable<File>>;
  videoFile: FormControl<Nullable<File>>;
  coverFile: FormControl<Nullable<File>>;
}

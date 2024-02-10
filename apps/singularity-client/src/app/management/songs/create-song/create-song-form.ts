import { FormControl } from '@angular/forms';
import { Nullable } from '@singularity/api-interfaces';
import { TuiFileLike } from '@taiga-ui/kit';

export interface CreateSongForm {
  txtFile: FormControl<Nullable<TuiFileLike>>;
  audioFile: FormControl<Nullable<TuiFileLike>>;
  videoFile: FormControl<Nullable<TuiFileLike>>;
  coverFile: FormControl<Nullable<TuiFileLike>>;
}

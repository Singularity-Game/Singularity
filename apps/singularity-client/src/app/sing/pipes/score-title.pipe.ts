import { Pipe, PipeTransform } from '@angular/core';
import { TranslocoService } from '@ngneat/transloco';

@Pipe({
  name: 'scoreTitle'
})
export class ScoreTitlePipe implements PipeTransform {

  constructor(private readonly transloco: TranslocoService) {
  }

  transform(value: number): string {
    if(value > 8000) {
      return this.transloco.translate('sing.scoreTitles.hitsinger');
    }

    if(value > 6000) {
      return this.transloco.translate('sing.scoreTitles.leadsinger');
    }

    if(value > 4000) {
      return this.transloco.translate('sing.scoreTitles.risingStar');
    }

    if(value > 2000) {
      return this.transloco.translate('sing.scoreTitles.amateur');
    }

    return this.transloco.translate('sing.scoreTitles.toneDeaf');
  }

}

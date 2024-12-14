import { Component, OnInit } from '@angular/core';
import { PartyParticipantService } from '../party-participant.service';
import { map, Observable } from 'rxjs';
import { Optional } from '@singularity/api-interfaces';
import { ActivatedRoute } from '@angular/router';
import { SuiGlobalColorService } from '@singularity/ui';
import { TranslocoService } from '@ngneat/transloco';

@Component({
  selector: 'singularity-party-smartphone-view',
  templateUrl: './party-smartphone-view.component.html',
  styleUrl: './party-smartphone-view.component.scss'
})
export class PartySmartphoneViewComponent implements OnInit {
  public isParticipant$?: Observable<Optional<boolean>>;
  public error = '';

  constructor(private readonly partyParticipantService: PartyParticipantService,
              private readonly activatedRoute: ActivatedRoute,
              private readonly suiGlobalColorService: SuiGlobalColorService,
              private readonly translocoService: TranslocoService) {
  }

  public ngOnInit(): void {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    if (!id) {
      this.setError(this.translocoService.translate('party.smartphone.wrongId'));
      return;
    }

    this.isParticipant$ = this.partyParticipantService.isParticipant$(id)
      .pipe(map((isParticipant: boolean) => new Optional(isParticipant)));
  }

  private setError(message: string) {
    this.suiGlobalColorService.setPrimaryColor('#ef4444');
    this.error = message;
    return;
  }
}

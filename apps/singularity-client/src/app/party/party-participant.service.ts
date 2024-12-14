import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ApiService } from '../shared/api.service';
import { Nullable, PartyParticipantDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyParticipantService {

  constructor(private readonly api: ApiService) { }

  public isParticipant$(partyId: string): Observable<boolean> {
    const savedPartyId = localStorage.getItem('party-participant-party-id');
    const savedParticipantId = localStorage.getItem('party-participant-id');

    if (savedPartyId !== partyId) {
      return of(false);
    }

    return this.api.get$<Nullable<PartyParticipantDto>>(`/api/party/${savedPartyId}/participant/${savedParticipantId}`)
      .pipe(map((value) => !!value));
  }

  public getMe$(): Observable<Nullable<PartyParticipantDto>> {
    const savedPartyId = localStorage.getItem('party-participant-party-id');
    const savedParticipantId = localStorage.getItem('party-participant-id');

    return this.api.get$<Nullable<PartyParticipantDto>>(`/api/party/${savedPartyId}/participant/${savedParticipantId}`);
  }
}

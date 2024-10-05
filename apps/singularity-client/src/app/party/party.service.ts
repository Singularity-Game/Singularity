import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreatePartyDto, Nullable, PartyDto } from '@singularity/api-interfaces';
import { ApiService } from '../shared/api.service';
import { PartyParticipantDto } from '@singularity/api-interfaces';

@Injectable()
export class PartyService {

  constructor(private readonly api: ApiService) { }

  public createParty$(name: string): Observable<PartyDto> {
    const party = new CreatePartyDto();
    party.name = name;

    return this.api.post$<PartyDto>('/api/party', party);
  }

  public getMyParty$(): Observable<Nullable<PartyDto>> {
    return this.api.get$<PartyDto>('/api/party/my');
  }

  public getPartyById$(id: string): Observable<Nullable<PartyDto>> {
    return this.api.get$<PartyDto>(`/api/party/${id}`);
  }

  public joinParty$(partyId: string, userName: string, profilePictureBase64: string): Observable<PartyParticipantDto> {
    return this.api.post$<PartyParticipantDto>(`/api/party/${partyId}/join`, { name: userName, profilePictureBase64: profilePictureBase64 })
      .pipe(tap((value: PartyParticipantDto) => {
        localStorage.setItem('party-participant-party-id', partyId);
        localStorage.setItem('party-participant-id', value.id);
      }));
  }
}

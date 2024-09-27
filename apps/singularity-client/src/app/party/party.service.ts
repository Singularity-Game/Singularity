import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreatePartyDto, Nullable, PartyDto } from '@singularity/api-interfaces';
import { ApiService } from '../shared/api.service';

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
}

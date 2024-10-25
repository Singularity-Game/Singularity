import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { CreatePartyDto, Nullable, PartyDto, PartyParticipantDto, SongOverviewDto } from '@singularity/api-interfaces';
import { ApiService } from '../shared/api.service';
import { SseService } from '../shared/sse.service';

@Injectable()
export class PartyService {

  constructor(private readonly api: ApiService,
              private readonly sse: SseService) {

  }

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

  public getPartySongs$(partyId: string): Observable<SongOverviewDto[]> {
    return this.api.get$(`api/party/${partyId}/songs`);
  }

  public getCurrentSong$(partyId: string): Observable<SongOverviewDto> {
    return this.sse.getMessages$(`api/party/${partyId}/current-song`);
  }

  public setCurrentSong$(song: SongOverviewDto): Observable<void> {
    return this.api.post$(`api/party/my/current-song`, { songId: song.id });
  }
}

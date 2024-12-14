import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  CreatePartyDto,
  Nullable,
  PartyDto,
  PartyParticipantDto,
  PartyQueueItemDto,
  SongOverviewDto
} from '@singularity/api-interfaces';
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

  public getPartyQueue$(partyId: string): Observable<PartyQueueItemDto[]> {
    return this.sse.getMessages$(`api/party/${partyId}/queue`);
  }

  public queueSong$(partyId: string, song: SongOverviewDto, participant: PartyParticipantDto): Observable<PartyQueueItemDto> {
    const partyQueueItem = { song: song, participants: [participant] };

    return this.api.post$(`api/party/${partyId}/queue`, partyQueueItem);
  }

  public joinQueuedSong$(partyId: string, queueItemId: string, participant: PartyParticipantDto): Observable<PartyQueueItemDto> {
    const joinPartyQueueItemDto = { queueItemId: queueItemId, participantId: participant.id };

    return this.api.put$(`api/party/${partyId}/queue/${queueItemId}`, joinPartyQueueItemDto);
  }

  public leaveQueuedSong$(partyId: string, queueItemId: string, participant: PartyParticipantDto): Observable<PartyQueueItemDto> {
    return this.api.delete$(`api/party/${partyId}/queue/${queueItemId}/participants/${participant.id}`);
  }

  public popSong$(partyId: string, queueItemId: string): Observable<void> {
    return this.api.delete$(`api/party/${partyId}/queue/${queueItemId}`);
  }
}

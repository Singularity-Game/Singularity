import { Injectable } from '@nestjs/common';
import { Party } from './models/party';
import { Nullable, UUID } from '@singularity/api-interfaces';
import { User } from '../user-management/models/user.entity';
import { PartyParticipant } from './models/party-participant';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';

@Injectable()
export class PartyService {

  private partiesSubject = new BehaviorSubject<Party[]>([]);

  public createParty(party: Party): Party {
    const parties = this.partiesSubject.getValue();
    parties.push(party);
    this.partiesSubject.next(parties);

    return party;
  }

  public endParty(id: UUID): Nullable<Party> {
    const parties = this.partiesSubject.getValue();
    const index = parties.findIndex(party => party.id === id);

    if(index === -1) {
      return null;
    }

    const party = parties[index];
    parties.splice(index, 1);

    this.partiesSubject.next(parties);

    return party;
  }

  public getPartyByUser(user: User): Nullable<Party> {
    return this.partiesSubject.getValue().find((party: Party) => party.creator.id === user.id) ?? null;
  }

  public getPartyById(id: string): Nullable<Party> {
    return this.partiesSubject.getValue().find((party: Party) => party.id === id) ?? null;
  }

  public getPartyParticipant(partyId: string, participantId: UUID): Nullable<PartyParticipant> {
    const party = this.getPartyById(partyId);

    if(!party) {
      return null;
    }

    return party.participants.find((participant: PartyParticipant) => participant.id === participantId) ?? null;
  }

  public joinParty(partyId: string, participant: PartyParticipant): void {
    const party = this.getPartyById(partyId);

    if(!party) {
      return;
    }

    party.participants.push(participant);
    this.partiesSubject.next(this.partiesSubject.getValue());
  }

  public getPartyParticipants$(partyId: string): Observable<PartyParticipant[]> {
    return this.partiesSubject.pipe(
      map((parties: Party[]) => parties.find(party => party.id === partyId)),
      filter(value => !!value),
      map((party: Party) => party.participants)
    )
  }

  public getPartyCurrentSongId$(partyId: string): Observable<number> {
    return this.partiesSubject.pipe(
      tap(() => console.log(1)),
      map((parties: Party[]) => parties.find(party => party.id === partyId)),
      tap(() => console.log(2)),
      filter(value => !!value),
      tap(() => console.log(3)),
      map((party: Party) => party.currentSongId)
    )
  }

  public setPartyCurrentSong(partyId: string, songId: number): void {
    const party = this.getPartyById(partyId);
    party.currentSongId = songId;
    this.partiesSubject.next(this.partiesSubject.getValue());
  }
}

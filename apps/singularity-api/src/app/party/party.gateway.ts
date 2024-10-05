import { MessageBody, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { PartyService } from './party.service';
import { Observable } from 'rxjs';
import { PartyParticipant } from './models/party-participant';

@WebSocketGateway(80, { namespace: 'party' })
export class PartyGateway {

  constructor(private readonly partyService: PartyService) {
  }

  @SubscribeMessage('participants')
  handleEvent(@MessageBody() partyId: string): Observable<PartyParticipant[]> {
    return this.partyService.getPartyParticipants$(partyId);
  }
}

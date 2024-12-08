import { UUID } from '../shared/uuid';

export class JoinPartyQueueItemDto {
  public queueItemId!: UUID;
  public participantId!: UUID;
}

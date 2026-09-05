import { UUID } from '../shared/uuid';

export class PartyParticipantDto {
  public id!: UUID;
  public name!: string;
  public pictureBase64!: string;
  public totalPoints!: number;
  public totalPlays!: number;
}

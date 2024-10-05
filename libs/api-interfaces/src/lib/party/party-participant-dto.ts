import { UUID } from '../shared/uuid';
import { AutoMap } from '@automapper/classes';

export class PartyParticipantDto {
  @AutoMap()
  public readonly id!: UUID;

  @AutoMap()
  public readonly name!: string;

  @AutoMap()
  public readonly pictureBase64!: string;

  @AutoMap()
  public totalPoints!: number;

  @AutoMap()
  public totalPlays!: number;
}

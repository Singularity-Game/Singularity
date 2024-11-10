import { UUID } from '@singularity/api-interfaces';
import { AutoMap } from '@automapper/classes';

export class PartyParticipant {
  @AutoMap()
  public readonly id: UUID;

  @AutoMap()
  public readonly name: string;

  @AutoMap()
  public readonly pictureBase64: string;

  @AutoMap()
  public totalPoints = 0;

  @AutoMap()
  public totalPlays = 0;

  constructor(name: string, pictureBase64: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.pictureBase64 = pictureBase64;
  }
}

import { UUID } from '@singularity/api-interfaces';

export class PartyParticipant {
  public readonly id: UUID;
  public readonly name: string;
  public readonly pictureBase64: string;
  public totalPoints = 0;
  public totalPlays = 0;

  constructor(name: string, pictureBase64: string) {
    this.id = crypto.randomUUID();
    this.name = name;
    this.pictureBase64 = pictureBase64;
  }
}

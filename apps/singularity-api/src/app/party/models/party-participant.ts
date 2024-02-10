import { UUID } from '@singularity/api-interfaces';

export class PartyParticipant {
  public readonly id: UUID;
  public readonly name: string;
  public readonly pictureBase64: string;
  public totalPoints: number;
  public totalPlays: number;
}

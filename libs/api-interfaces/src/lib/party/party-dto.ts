import { UserDto } from '../authentication/user-dto';
import { AutoMap } from '@automapper/classes';

export class PartyDto {
  @AutoMap()
  id!: string;

  @AutoMap()
  name!: string;

  @AutoMap()
  creator!: UserDto;

  @AutoMap()
  lastInteraction!: Date;
}

import { AutoMap } from '@automapper/classes';
import { UUID } from '../shared/uuid';

export class UserDto {
  @AutoMap()
  id!: number;

  @AutoMap()
  username!: string;

  @AutoMap()
  email!: string;

  @AutoMap()
  profilePictureBase64!: string;

  @AutoMap()
  active!: boolean;

  @AutoMap()
  isAdmin!: boolean;
}

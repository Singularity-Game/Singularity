import { User } from '../models/user.entity';

export class AccessTokenWithUser {
  accessToken!: string;
  user: User;
}

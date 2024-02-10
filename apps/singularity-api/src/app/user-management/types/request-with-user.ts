import { Request } from 'express'
import { User } from "../models/user.entity";

export interface RequestWithUser extends Request {
  user: User;
}

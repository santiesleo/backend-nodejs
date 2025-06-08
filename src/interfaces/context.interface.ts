import { Request } from 'express';

import { User } from '../models/user.model';

export interface Context {
  user?: User;
  req?: Request;
} 
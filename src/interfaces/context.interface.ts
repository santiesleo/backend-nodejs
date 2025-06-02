import { User } from '../models/user.model';
import { Request } from 'express';

export interface Context {
  user?: User;
  req?: Request;
} 
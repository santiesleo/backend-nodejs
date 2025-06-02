import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Context } from '../interfaces/context.interface';

export const authMiddleware = async (context: Context) => {
  const authHeader = context.req?.headers.authorization;

  if (!authHeader) {
    return context;
  }

  try {
    const token = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    const user = await User.findByPk(decoded.id, { include: [Role] });
    if (!user) {
      throw new AuthenticationError('User not found');
    }

    context.user = user;
    return context;
  } catch (error) {
    throw new AuthenticationError('Invalid token');
  }
};
import { AuthenticationError } from 'apollo-server-express';
import jwt from 'jsonwebtoken';

import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Context } from '../interfaces/context.interface';

// Tipo para el payload del JWT
interface JwtPayload {
  id: number;
  email: string;
  iat?: number;
  exp?: number;
}

export const authMiddleware = async (context: Context): Promise<Context> => {
  const authHeader: string | undefined = context.req?.headers.authorization;

  // Si no hay header de autorización, simplemente retorna el contexto sin usuario
  if (!authHeader) {
    return context;
  }

  try {
    const token: string = authHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as JwtPayload;

    // Buscar el usuario en la base de datos e incluir sus roles
    const user = await User.findByPk(decoded.id, { include: [Role] });
    if (!user) {
      // Si no se encuentra el usuario, no lanzar error, solo dejar el usuario como undefined
      context.user = undefined;
      return context;
    }

    context.user = user;
    return context;
  } catch (error) {
    // Si el token es inválido o expiró, no lanzar error, solo dejar el usuario como undefined
    context.user = undefined;
    return context;
  }
};
import { AuthenticationError, UserInputError } from 'apollo-server-express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { Role } from '../models/role.model';
import { Context } from '../interfaces/context.interface';
import { UserAttributes } from '../interfaces/user.interface';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
  roleIds?: number[];
}

interface UpdateUserInput {
  name?: string;
  email?: string;
  password?: string;
  roleIds?: number[];
}

export const userResolvers = {
  Query: {
    me: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return User.findByPk(user.id, { include: [Role] });
    },

    users: async (_: any, __: any, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return User.findAll({ include: [Role] });
    },

    user: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');
      return User.findByPk(id, { include: [Role] });
    },
  },

  Mutation: {
    register: async (_: any, { input }: { input: CreateUserInput }) => {
      const { name, email, password, roleIds } = input;

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        throw new UserInputError('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const userData: Omit<UserAttributes, 'id'> = {
        name,
        email,
        password: hashedPassword,
      };

      const user = await User.create(userData);

      if (roleIds && roleIds.length > 0) {
        await user.setRoles(roleIds);
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      const userWithRoles = await User.findByPk(user.id, { include: [Role] });
      if (!userWithRoles) throw new Error('User not found after creation');

      return {
        token,
        user: userWithRoles,
      };
    },

    login: async (_: any, { email, password }: { email: string; password: string }) => {
      const user = await User.findOne({ where: { email }, include: [Role] });
      if (!user) {
        throw new UserInputError('Invalid credentials');
      }

      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        throw new UserInputError('Invalid credentials');
      }

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      return {
        token,
        user,
      };
    },

    updateUser: async (_: any, { id, input }: { id: string; input: UpdateUserInput }, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      // Solo superadmin puede modificar otros usuarios
      const isSuperAdmin = user.roles?.some((role: Role) => role.name === 'superadmin');
      if (user.id !== parseInt(id) && !isSuperAdmin) {
        throw new AuthenticationError('Not authorized');
      }

      const updateData: Partial<UserAttributes> = { ...input };
      if (input.password) {
        updateData.password = await bcrypt.hash(input.password, 10);
      }

      await targetUser.update(updateData);
      
      if (input.roleIds && input.roleIds.length > 0) {
        await targetUser.setRoles(input.roleIds);
      }

      const updatedUser = await User.findByPk(id, { include: [Role] });
      if (!updatedUser) throw new Error('User not found after update');

      return updatedUser;
    },

    deleteUser: async (_: any, { id }: { id: string }, { user }: Context) => {
      if (!user) throw new AuthenticationError('Not authenticated');

      const targetUser = await User.findByPk(id);
      if (!targetUser) {
        throw new UserInputError('User not found');
      }

      // Solo superadmin puede eliminar usuarios
      const isSuperAdmin = user.roles?.some((role: Role) => role.name === 'superadmin');
      if (!isSuperAdmin) {
        throw new AuthenticationError('Not authorized');
      }

      await targetUser.destroy();
      return true;
    },
  },
  User: {
    roles: async (parent: any) => {
      if (parent.roles && Array.isArray(parent.roles)) {
        return parent.roles;
      }
      if (typeof parent.getRoles === 'function') {
        return await parent.getRoles();
      }
      return [];
    }
  }
}; 
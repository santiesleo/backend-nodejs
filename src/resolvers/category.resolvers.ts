import { UserInputError, AuthenticationError } from 'apollo-server-express';

import { categoryService } from '../services/category.service';
import { categorySchema, updateCategorySchema } from '../schemas/category.schema';
import Category from '../models/category.model';
import { Context } from '../interfaces/context.interface';
import { Role } from '../models/role.model';

// Tipos para los argumentos de GraphQL
interface CategoryArgs {
  id: string;
}

interface CreateCategoryArgs {
  input: {
    name: string;
    description: string;
  };
}

interface UpdateCategoryArgs {
  id: string;
  input: {
    name?: string;
    description?: string;
  };
}

interface DeleteCategoryArgs {
  id: string;
}

// Tipo para el contexto (simplificado - para futura autenticación)
//interface GraphQLContext {
  //req: Express.Request;
  //user?: {
   // id: number;
    //email: string;
   // role: 'admin' | 'user';
  //};
  //isAuthenticated?: boolean;
//}

export const categoryResolvers = {
  Query: {
    categories: async (): Promise<Category[]> => {
      try {
        return await categoryService.findAll();
      } catch (error) {
        throw new Error('Error fetching categories');
      }
    },

    category: async (_: unknown, { id }: CategoryArgs): Promise<Category | null> => {
      const categoryId = parseInt(id);
      
      if (isNaN(categoryId)) {
        throw new UserInputError('Invalid category ID');
      }

      const category = await categoryService.findById(categoryId);
      
      if (!category) {
        throw new UserInputError('Category not found');
      }

      return category;
    }
  },

  Mutation: {
    createCategory: async (_: unknown, { input }: CreateCategoryArgs, context: Context): Promise<Category> => {
      // Solo superadmin puede crear categorías
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede crear categorías');
      }
      try {
        const validationResult = categorySchema.safeParse(input);
        if (!validationResult.success) {
          throw new UserInputError('Validation error', {
            validationErrors: validationResult.error.errors
          });
        }
        const newCategory = await categoryService.create(validationResult.data);
        return newCategory;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error creating category');
      }
    },

    updateCategory: async (_: unknown, { id, input }: UpdateCategoryArgs, context: Context): Promise<Category> => {
      // Solo superadmin puede actualizar categorías
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede actualizar categorías');
      }
      try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) {
          throw new UserInputError('Invalid category ID');
        }
        const validationResult = updateCategorySchema.safeParse(input);
        if (!validationResult.success) {
          throw new UserInputError('Validation error', {
            validationErrors: validationResult.error.errors
          });
        }
        const updatedCategory = await categoryService.update(categoryId, validationResult.data);
        if (!updatedCategory) {
          throw new UserInputError('Category not found');
        }
        return updatedCategory;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error updating category');
      }
    },

    deleteCategory: async (_: unknown, { id }: DeleteCategoryArgs, context: Context): Promise<boolean> => {
      // Solo superadmin puede eliminar categorías
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede eliminar categorías');
      }
      try {
        const categoryId = parseInt(id);
        if (isNaN(categoryId)) {
          throw new UserInputError('Invalid category ID');
        }
        // Verificar si hay productos asociados
        const productsCount = await categoryService.hasProducts(categoryId);
        if (productsCount > 0) {
          throw new UserInputError(
            `Cannot delete category. There are ${productsCount} products associated with it.`
          );
        }
        const deletedCategory = await categoryService.delete(categoryId);
        if (!deletedCategory) {
          throw new UserInputError('Category not found');
        }
        return true;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error deleting category');
      }
    }
  }
};
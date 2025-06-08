import { AuthenticationError, UserInputError } from 'apollo-server-express';

import { categoryService } from '../services/category.service';
import { categorySchema, updateCategorySchema } from '../schemas/category.schema';

export const categoryResolvers = {
  Query: {
    categories: async () => {
      try {
        return await categoryService.findAll();
      } catch (error) {
        throw new Error('Error fetching categories');
      }
    },

    category: async (_: any, { id }: { id: string }) => {
      try {
        const categoryId = parseInt(id);
        
        if (isNaN(categoryId)) {
          throw new UserInputError('Invalid category ID');
        }

        const category = await categoryService.findById(categoryId);
        
        if (!category) {
          throw new UserInputError('Category not found');
        }

        return category;
      } catch (error) {
        throw error;
      }
    }
  },

  Mutation: {
    createCategory: async (_: any, { input }: { input: any }, context: any) => {
      // Por ahora sin autenticación, la agregaremos después
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

    updateCategory: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
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

    deleteCategory: async (_: any, { id }: { id: string }, context: any) => {
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
import { UserInputError } from 'apollo-server-express';

import { productService } from '../services/product.service';
import { productSchema } from '../schemas/product.schema';

export const productResolvers = {
  Query: {
    products: async () => {
      try {
        return await productService.findAll();
      } catch (error) {
        throw new Error('Error fetching products');
      }
    },

    product: async (_: any, { id }: { id: string }) => {
      try {
        const productId = parseInt(id);
        
        if (isNaN(productId)) {
          throw new UserInputError('Invalid product ID');
        }

        const product = await productService.findById(productId);
        
        if (!product) {
          throw new UserInputError('Product not found');
        }

        return product;
      } catch (error) {
        throw error;
      }
    },

    productsByCategory: async (_: any, { categoryId }: { categoryId: string }) => {
      try {
        const catId = parseInt(categoryId);
        
        if (isNaN(catId)) {
          throw new UserInputError('Invalid category ID');
        }

        return await productService.findByCategory(catId);
      } catch (error) {
        throw new Error('Error fetching products by category');
      }
    }
  },

  Mutation: {
    createProduct: async (_: any, { input }: { input: any }, context: any) => {
      try {
        // Convertir category_id de string a number para validación
        const productData = {
          ...input,
          category_id: parseInt(input.category_id)
        };

        // Validar datos usando tu schema existente de Zod
        const validationResult = productSchema.safeParse(productData);
        if (!validationResult.success) {
          throw new UserInputError('Validation error', {
            validationErrors: validationResult.error.errors
          });
        }

        // Validaciones adicionales de negocio
        if (productData.price <= 0) {
          throw new UserInputError('Price must be greater than 0');
        }

        if (productData.stock < 0) {
          throw new UserInputError('Stock cannot be negative');
        }

        // Verificar que la categoría existe
        const Category = require('../models/category.model').default;
        const category = await Category.findByPk(productData.category_id);
        if (!category) {
          throw new UserInputError('Category not found');
        }

        const newProduct = await productService.create(validationResult.data);
        return newProduct;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error creating product');
      }
    },

    updateProduct: async (_: any, { id, input }: { id: string, input: any }, context: any) => {
      try {
        const productId = parseInt(id);
        
        if (isNaN(productId)) {
          throw new UserInputError('Invalid product ID');
        }

        // Verificar que el producto existe
        const existingProduct = await productService.findById(productId);
        if (!existingProduct) {
          throw new UserInputError('Product not found');
        }

        // Preparar datos para actualización con validaciones
        const updateData: any = {};

        if (input.nombre !== undefined) {
          if (!input.nombre || input.nombre.trim() === '') {
            throw new UserInputError('Product name cannot be empty');
          }
          updateData.nombre = input.nombre;
        }

        if (input.description !== undefined) {
          if (!input.description || input.description.trim() === '') {
            throw new UserInputError('Product description cannot be empty');
          }
          updateData.description = input.description;
        }

        if (input.price !== undefined) {
          if (input.price <= 0) {
            throw new UserInputError('Price must be greater than 0');
          }
          updateData.price = input.price;
        }

        if (input.stock !== undefined) {
          if (input.stock < 0) {
            throw new UserInputError('Stock cannot be negative');
          }
          updateData.stock = input.stock;
        }

        if (input.image !== undefined) {
          updateData.image = input.image;
        }

        if (input.category_id !== undefined) {
          const categoryId = parseInt(input.category_id);
          if (isNaN(categoryId)) {
            throw new UserInputError('Invalid category ID');
          }
          
          // Verificar que la categoría existe
          const Category = require('../models/category.model').default;
          const category = await Category.findByPk(categoryId);
          if (!category) {
            throw new UserInputError('Category not found');
          }
          
          updateData.category_id = categoryId;
        }

        const updatedProduct = await productService.update(productId, updateData);
        
        if (!updatedProduct) {
          throw new UserInputError('Product not found');
        }

        return updatedProduct;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error updating product');
      }
    },

    deleteProduct: async (_: any, { id }: { id: string }, context: any) => {
      try {
        const productId = parseInt(id);
        
        if (isNaN(productId)) {
          throw new UserInputError('Invalid product ID');
        }

        const deletedProduct = await productService.delete(productId);
        
        if (!deletedProduct) {
          throw new UserInputError('Product not found');
        }

        // Eliminar producto no afecta las categorías, solo se elimina el producto
        return true;
      } catch (error) {
        if (error instanceof UserInputError) {
          throw error;
        }
        throw new Error('Error deleting product');
      }
    }
  },

  Product: {
    // Resolver para la relación con category
    category: async (parent: any) => {
      if (parent.category) {
        return parent.category;
      }
      // Si no viene incluida, la buscamos
      const Category = require('../models/category.model').default;
      return await Category.findByPk(parent.category_id);
    }
  },

  Category: {
    // Resolver para la relación con products
    products: async (parent: any) => {
      return await productService.findByCategory(parent.id);
    }
  }
};
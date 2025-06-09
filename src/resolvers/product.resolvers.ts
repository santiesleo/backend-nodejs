import { UserInputError, AuthenticationError } from 'apollo-server-express';

import { productService } from '../services/product.service';
import { productSchema } from '../schemas/product.schema';
import Category from '../models/category.model';
import { Product, ProductAttributes } from '../models/product.model';
import { Context } from '../interfaces/context.interface';
import { Role } from '../models/role.model';

// Tipos para los argumentos de GraphQL
interface ProductArgs {
  id: string;
}

interface ProductsByCategoryArgs {
  categoryId: string;
}

interface CreateProductArgs {
  input: {
    nombre: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    category_id: string; // Viene como string desde GraphQL
  };
}

interface UpdateProductArgs {
  id: string;
  input: {
    nombre?: string;
    description?: string;
    price?: number;
    stock?: number;
    image?: string;
    category_id?: string; // Viene como string desde GraphQL
  };
}

interface DeleteProductArgs {
  id: string;
}

// Tipo para el contexto (simplificado)
//interface GraphQLContext {
  //req: Express.Request;
//}

// Tipo para el parent en resolvers
interface ProductParent extends ProductAttributes {
  category?: Category;
}

interface CategoryParent {
  id: number;
}

export const productResolvers = {
  Query: {
    products: async (): Promise<Product[]> => {
      try {
        return await productService.findAll();
      } catch (error) {
        throw new Error('Error fetching products');
      }
    },

    product: async (_: unknown, { id }: ProductArgs): Promise<Product | null> => {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        throw new UserInputError('Invalid product ID');
      }

      const product = await productService.findById(productId);
      
      if (!product) {
        throw new UserInputError('Product not found');
      }

      return product;
    },

    productsByCategory: async (_: unknown, { categoryId }: ProductsByCategoryArgs): Promise<Product[]> => {
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
    createProduct: async (_: unknown, { input }: CreateProductArgs, context: Context): Promise<Product> => {
      // Solo superadmin puede crear productos
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede crear productos');
      }
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

    updateProduct: async (_: unknown, { id, input }: UpdateProductArgs, context: Context): Promise<Product> => {
      // Solo superadmin puede actualizar productos
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede actualizar productos');
      }
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
        const updateData: Partial<ProductAttributes> = {};

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

    deleteProduct: async (_: unknown, { id }: DeleteProductArgs, context: Context): Promise<boolean> => {
      // Solo superadmin puede eliminar productos
      const user = context.user;
      if (!user || !user.roles?.some((role: Role) => role.name === 'superadmin')) {
        throw new AuthenticationError('Solo el superadmin puede eliminar productos');
      }
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
    category: async (parent: ProductParent): Promise<Category | null> => {
      if (parent.category) {
        return parent.category;
      }
      // Si no viene incluida, la buscamos
      return await Category.findByPk(parent.category_id);
    }
  },

  Category: {
    // Resolver para la relación con products
    products: async (parent: CategoryParent): Promise<Product[]> => {
      return await productService.findByCategory(parent.id);
    }
  }
};
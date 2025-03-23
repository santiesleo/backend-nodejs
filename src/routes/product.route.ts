// src/routes/product.route.ts
import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller';

export const productRouter = Router();

// Rutas públicas
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/category/:categoryId', getProductsByCategory);
productRouter.post('/', createProduct);
productRouter.put('/:id', updateProduct);
productRouter.delete('/:id', deleteProduct);
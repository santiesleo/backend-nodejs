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
import { auth } from '../middlewares/auth.middleware';
import { checkAdmin } from '../middlewares/role.middleware';

export const productRouter = Router();

// Rutas públicas (para cliente y admin)
productRouter.get('/', getProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/category/:categoryId', getProductsByCategory);

// Rutas protegidas (solo admin)
productRouter.post('/', auth, checkAdmin, createProduct);
productRouter.put('/:id', auth, checkAdmin, updateProduct);
productRouter.delete('/:id', auth, checkAdmin, deleteProduct);
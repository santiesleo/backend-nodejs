import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/product.controller';
//import { auth } from '../middlewares/auth.middleware';
import { productAuth } from '../middlewares/productAuth.middleware';
import { checkAdmin } from '../middlewares/role.middleware';

export const productRouter = Router();

// Rutas públicas (para cliente y admin)
productRouter.get('/', getProducts);
productRouter.get('/category/:categoryId', getProductsByCategory);
productRouter.get('/:id', getProductById);

// Rutas protegidas (solo admin)
productRouter.post('/', productAuth, checkAdmin, createProduct);
productRouter.put('/:id', productAuth, checkAdmin, updateProduct);
productRouter.delete('/:id', productAuth, checkAdmin, deleteProduct);
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

const router = Router();

// Todas las rutas son públicas por ahora
router.get('/', getProducts);
router.get('/:id', getProductById);
router.get('/category/:categoryId', getProductsByCategory);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
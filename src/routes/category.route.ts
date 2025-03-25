import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
//import { auth } from '../middlewares/auth.middleware';
import { productAuth } from '../middlewares/productAuth.middleware';
import { checkAdmin } from '../middlewares/role.middleware';

export const categoryRouter = Router();

// Rutas publicas
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);

// Operaciones protegidas
categoryRouter.post('/', productAuth, checkAdmin, categoryController.createCategory);
categoryRouter.put('/:id', productAuth, checkAdmin, categoryController.updateCategory);
categoryRouter.delete('/:id', productAuth, checkAdmin, categoryController.deleteCategory);
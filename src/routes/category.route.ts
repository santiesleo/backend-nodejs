import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { auth } from '../middlewares/auth.middleware';
import { checkAdmin } from '../middlewares/role.middleware';

export const categoryRouter = Router();

// Rutas publicas
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);

// Operaciones protegidas
categoryRouter.post('/', auth, checkAdmin, categoryController.createCategory);
categoryRouter.put('/:id', auth, checkAdmin, categoryController.updateCategory);
categoryRouter.delete('/:id', auth, checkAdmin, categoryController.deleteCategory);
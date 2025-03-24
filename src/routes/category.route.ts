import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';
import { auth } from '../middlewares/auth.middleware';
import { checkAdmin } from '../middlewares/role.middleware';

export const categoryRouter = Router();

// Rutas públicas (cualquiera puede ver las categorías)
categoryRouter.get('/', categoryController.getCategories);
categoryRouter.get('/:id', categoryController.getCategoryById);

// Rutas protegidas (solo administradores pueden modificar categorías)
categoryRouter.post('/', auth, checkAdmin, categoryController.createCategory);
categoryRouter.put('/:id', auth, checkAdmin, categoryController.updateCategory);
categoryRouter.delete('/:id', auth, checkAdmin, categoryController.deleteCategory);
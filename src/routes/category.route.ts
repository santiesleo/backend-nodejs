// src/routes/category.route.ts
import { Router } from 'express';
import * as categoryController from '../controllers/category.controller';

export const categoryRouter = Router();

categoryRouter.get('/', categoryController.getCategories);
categoryRouter.post('/', categoryController.createCategory);
categoryRouter.get('/:id', categoryController.getCategoryById);
categoryRouter.put('/:id', categoryController.updateCategory);
categoryRouter.delete('/:id', categoryController.deleteCategory);
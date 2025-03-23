// src/controllers/category.controller.ts
import { Request, Response } from 'express';
import { categoryService } from '../services/category.service';
import { categorySchema, updateCategorySchema } from '../schemas/category.schema';

export const getCategories = async (req: Request, res: Response) => {
    try {
        const categories = await categoryService.findAll();
        return res.status(200).json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getCategoryById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        
        const category = await categoryService.findById(id);
        
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        return res.status(200).json(category);
    } catch (error) {
        console.error('Error fetching category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createCategory = async (req: Request, res: Response) => {
    try {
        // Validar datos
        const validationResult = categorySchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: validationResult.error.errors 
            });
        }
        
        const newCategory = await categoryService.create(validationResult.data);
        return res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        
        // Validar datos
        const validationResult = updateCategorySchema.safeParse(req.body);
        if (!validationResult.success) {
            return res.status(400).json({ 
                message: 'Validation error', 
                errors: validationResult.error.errors 
            });
        }
        
        const updatedCategory = await categoryService.update(id, validationResult.data);
        
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        return res.status(200).json(updatedCategory);
    } catch (error) {
        console.error('Error updating category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteCategory = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        
        if (isNaN(id)) {
            return res.status(400).json({ message: 'Invalid category ID' });
        }
        
        const deletedCategory = await categoryService.delete(id);
        
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        
        return res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Error deleting category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
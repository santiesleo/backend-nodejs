import { Request, Response } from 'express';
import { productService } from '../services/product.service';

export const getProducts = async (req: Request, res: Response) => {
    try {
        const products = await productService.findAll();
        return res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductById = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const product = await productService.findById(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const getProductsByCategory = async (req: Request, res: Response) => {
    try {
        const categoryId = parseInt(req.params.categoryId);
        const products = await productService.findByCategory(categoryId);
        return res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by category:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const createProduct = async (req: Request, res: Response) => {
    try {
        const newProduct = await productService.create(req.body);
        return res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const updatedProduct = await productService.update(id, req.body);
        
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const id = parseInt(req.params.id);
        const deletedProduct = await productService.delete(id);
        
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        
        return res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
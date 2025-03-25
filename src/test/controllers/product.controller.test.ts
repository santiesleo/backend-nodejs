import { Request, Response } from 'express';
import { 
  getProducts, 
  getProductById, 
  getProductsByCategory,
  createProduct,
  updateProduct,
  deleteProduct 
} from '../../controllers/product.controller';
import { productService } from '../../services/product.service';

// Mock del productService
jest.mock('../../services/product.service', () => ({
  productService: {
    findAll: jest.fn(),
    findById: jest.fn(),
    findByCategory: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

describe('ProductController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('getProducts', () => {
    it('should return all products with status 200', async () => {
      const mockProducts = [
        { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 },
        { id: 2, nombre: 'Teléfono', description: 'Un teléfono', price: 500, stock: 20, category_id: 1 }
      ];
      
      (productService.findAll as jest.Mock).mockResolvedValue(mockProducts);

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(productService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors and return status 500', async () => {
      (productService.findAll as jest.Mock).mockRejectedValue(new Error('Server error'));

      await getProducts(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('getProductById', () => {
    it('should return a product with status 200', async () => {
      const mockProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 };
      mockRequest.params = { id: '1' };
      
      (productService.findById as jest.Mock).mockResolvedValue(mockProduct);

      await getProductById(mockRequest as Request, mockResponse as Response);

      expect(productService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
    });

    it('should return 404 if product not found', async () => {
      mockRequest.params = { id: '999' };
      
      (productService.findById as jest.Mock).mockResolvedValue(null);

      await getProductById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  describe('getProductsByCategory', () => {
    it('should return products by category with status 200', async () => {
      const mockProducts = [
        { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 },
        { id: 2, nombre: 'Teléfono', description: 'Un teléfono', price: 500, stock: 20, category_id: 1 }
      ];
      mockRequest.params = { categoryId: '1' };
      
      (productService.findByCategory as jest.Mock).mockResolvedValue(mockProducts);

      await getProductsByCategory(mockRequest as Request, mockResponse as Response);

      expect(productService.findByCategory).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });

    it('should handle errors and return status 500', async () => {
      mockRequest.params = { categoryId: '1' };
      
      (productService.findByCategory as jest.Mock).mockRejectedValue(new Error('Server error'));

      await getProductsByCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('createProduct', () => {
    it('should create a product and return status 201', async () => {
      const productData = { nombre: 'Nuevo Producto', description: 'Descripción', price: 100, stock: 5, category_id: 1 };
      const mockCreatedProduct = { id: 3, ...productData };
      
      mockRequest.body = productData;
      
      (productService.create as jest.Mock).mockResolvedValue(mockCreatedProduct);

      await createProduct(mockRequest as Request, mockResponse as Response);

      expect(productService.create).toHaveBeenCalledWith(productData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedProduct);
    });

    it('should handle errors and return status 500', async () => {
      mockRequest.body = { nombre: 'Test Product', description: 'Test description', price: 100, stock: 5, category_id: 1 };
      
      (productService.create as jest.Mock).mockRejectedValue(new Error('Server error'));

      await createProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  describe('updateProduct', () => {
    it('should update a product and return status 200', async () => {
      const updateData = { price: 120, stock: 8 };
      const mockUpdatedProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 120, stock: 8, category_id: 1 };
      
      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      
      (productService.update as jest.Mock).mockResolvedValue(mockUpdatedProduct);

      await updateProduct(mockRequest as Request, mockResponse as Response);

      expect(productService.update).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedProduct);
    });

    it('should return 404 if product to update not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { price: 120 };
      
      (productService.update as jest.Mock).mockResolvedValue(null);

      await updateProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  describe('deleteProduct', () => {
    it('should delete a product and return status 200', async () => {
      const mockDeletedProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 };
      
      mockRequest.params = { id: '1' };
      
      (productService.delete as jest.Mock).mockResolvedValue(mockDeletedProduct);

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(productService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });

    it('should return 404 if product to delete not found', async () => {
      mockRequest.params = { id: '999' };
      
      (productService.delete as jest.Mock).mockResolvedValue(null);

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
});
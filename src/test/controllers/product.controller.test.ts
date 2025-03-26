// Importaciones necesarias de Express y los controladores a probar
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

// Creación de mock para el servicio de productos
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

// Suite de pruebas principal para ProductController
describe('ProductController', () => {
  // Declaración de variables para simular request/response HTTP
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  // Configuración inicial antes de cada prueba
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // Pruebas para el método getProducts
  describe('getProducts', () => {
    // Verifica que retorne todos los productos con status 200
    it('should return all products with status 200', async () => {
      // Datos de ejemplo que debe devolver el servicio
      const mockProducts = [
        { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 },
        { id: 2, nombre: 'Teléfono', description: 'Un teléfono', price: 500, stock: 20, category_id: 1 }
      ];
      
      // Configurar el mock para que devuelva los productos de ejemplo
      (productService.findAll as jest.Mock).mockResolvedValue(mockProducts);

      // Ejecutar el controlador
      await getProducts(mockRequest as Request, mockResponse as Response);

      // Verificar que se llamó al servicio y se devolvió la respuesta correcta
      expect(productService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProducts);
    });

    // Verifica el manejo de errores
    it('should handle errors and return status 500', async () => {
      // Simular error en el servicio
      (productService.findAll as jest.Mock).mockRejectedValue(new Error('Server error'));

      // Ejecutar el controlador
      await getProducts(mockRequest as Request, mockResponse as Response);

      // Verificar que se maneja el error correctamente
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // Pruebas para el método getProductById
  describe('getProductById', () => {
    // Verifica que retorne un producto específico con status 200
    it('should return a product with status 200', async () => {
      const mockProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 };
      mockRequest.params = { id: '1' };
      
      (productService.findById as jest.Mock).mockResolvedValue(mockProduct);

      await getProductById(mockRequest as Request, mockResponse as Response);

      expect(productService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockProduct);
    });

    // Verifica que retorne 404 si el producto no existe
    it('should return 404 if product not found', async () => {
      mockRequest.params = { id: '999' };
      
      (productService.findById as jest.Mock).mockResolvedValue(null);

      await getProductById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  // Pruebas para el método getProductsByCategory
  describe('getProductsByCategory', () => {
    // Verifica que retorne productos filtrados por categoría
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

    // Verifica el manejo de errores
    it('should handle errors and return status 500', async () => {
      mockRequest.params = { categoryId: '1' };
      
      (productService.findByCategory as jest.Mock).mockRejectedValue(new Error('Server error'));

      await getProductsByCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // Pruebas para el método createProduct
  describe('createProduct', () => {
    // Verifica la creación exitosa de un producto
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

    // Verifica el manejo de errores
    it('should handle errors and return status 500', async () => {
      mockRequest.body = { nombre: 'Test Product', description: 'Test description', price: 100, stock: 5, category_id: 1 };
      
      (productService.create as jest.Mock).mockRejectedValue(new Error('Server error'));

      await createProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // Pruebas para el método updateProduct
  describe('updateProduct', () => {
    // Verifica la actualización exitosa de un producto
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

    // Verifica que retorne 404 si el producto a actualizar no existe
    it('should return 404 if product to update not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { price: 120 };
      
      (productService.update as jest.Mock).mockResolvedValue(null);

      await updateProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });

  // Pruebas para el método deleteProduct
  describe('deleteProduct', () => {
    // Verifica la eliminación exitosa de un producto
    it('should delete a product and return status 200', async () => {
      const mockDeletedProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 };
      
      mockRequest.params = { id: '1' };
      
      (productService.delete as jest.Mock).mockResolvedValue(mockDeletedProduct);

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(productService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product deleted successfully' });
    });

    // Verifica que retorne 404 si el producto a eliminar no existe
    it('should return 404 if product to delete not found', async () => {
      mockRequest.params = { id: '999' };
      
      (productService.delete as jest.Mock).mockResolvedValue(null);

      await deleteProduct(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Product not found' });
    });
  });
});
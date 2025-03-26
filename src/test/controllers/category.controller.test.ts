// Importaciones necesarias
import { Request, Response } from 'express';
import { 
  getCategories, 
  getCategoryById, 
  createCategory,
  updateCategory,
  deleteCategory 
} from '../../controllers/category.controller';
import { categoryService } from '../../services/category.service';

// Creación del mock para categoryService (simulación del servicio)
jest.mock('../../services/category.service', () => ({
  categoryService: {
    findAll: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    hasProducts: jest.fn() 
  }
}));

// Bloque principal de pruebas para CategoryController
describe('CategoryController', () => {
  // Variables para simular peticiones y respuestas HTTP
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  // Se ejecuta antes de cada prueba para reiniciar las variables y limpiar los mocks
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  // Pruebas para el método getCategories
  describe('getCategories', () => {
    // Prueba el caso exitoso de obtener todas las categorías
    it('should return all categories with status 200', async () => {
      // Datos simulados que devolverá el servicio
      const mockCategories = [
        { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' },
        { id: 2, name: 'Ropa', description: 'Productos de vestir' }
      ];
      
      // Configura el mock para que devuelva los datos simulados
      (categoryService.findAll as jest.Mock).mockResolvedValue(mockCategories);

      // Llama al controlador con los mocks
      await getCategories(mockRequest as Request, mockResponse as Response);

      // Verificaciones de que el controlador funcionó correctamente
      expect(categoryService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategories);
    });

    // Prueba el manejo de errores en getCategories
    it('should handle errors and return status 500', async () => {
      // Simula un error en el servicio
      (categoryService.findAll as jest.Mock).mockRejectedValue(new Error('Server error'));

      // Llama al controlador
      await getCategories(mockRequest as Request, mockResponse as Response);

      // Verifica que se devuelve un error 500
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // Pruebas para el método getCategoryById
  describe('getCategoryById', () => {
    // Prueba obtener una categoría por ID exitosamente
    it('should return a category with status 200', async () => {
      const mockCategory = { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' };
      mockRequest.params = { id: '1' };
      
      (categoryService.findById as jest.Mock).mockResolvedValue(mockCategory);

      await getCategoryById(mockRequest as Request, mockResponse as Response);

      expect(categoryService.findById).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCategory);
    });

    // Prueba cuando la categoría no existe
    it('should return 404 if category not found', async () => {
      mockRequest.params = { id: '999' };
      
      (categoryService.findById as jest.Mock).mockResolvedValue(null);

      await getCategoryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });

    // Prueba con ID inválido
    it('should return 400 if id is invalid', async () => {
      mockRequest.params = { id: 'invalid' };

      await getCategoryById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Invalid category ID' });
    });
  });

  // Pruebas para el método createCategory
  describe('createCategory', () => {
    // Prueba creación exitosa
    it('should create a category and return status 201', async () => {
      const categoryData = { name: 'Nueva', description: 'Descripción' };
      const mockCreatedCategory = { id: 3, ...categoryData };
      
      mockRequest.body = categoryData;
      
      (categoryService.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

      await createCategory(mockRequest as Request, mockResponse as Response);

      expect(categoryService.create).toHaveBeenCalledWith(categoryData);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockCreatedCategory);
    });

    // Prueba manejo de errores
    it('should handle errors and return status 500', async () => {
      mockRequest.body = { name: 'Test Category', description: 'Test description' };
      
      (categoryService.create as jest.Mock).mockRejectedValue(new Error('Server error'));

      await createCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Internal server error' });
    });
  });

  // Pruebas para el método updateCategory
  describe('updateCategory', () => {
    // Prueba actualización exitosa
    it('should update a category and return status 200', async () => {
      const updateData = { name: 'Actualizada' };
      const mockUpdatedCategory = { id: 1, name: 'Actualizada', description: 'Descripción' };
      
      mockRequest.params = { id: '1' };
      mockRequest.body = updateData;
      
      (categoryService.update as jest.Mock).mockResolvedValue(mockUpdatedCategory);

      await updateCategory(mockRequest as Request, mockResponse as Response);

      expect(categoryService.update).toHaveBeenCalledWith(1, updateData);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUpdatedCategory);
    });

    // Prueba cuando la categoría a actualizar no existe
    it('should return 404 if category to update not found', async () => {
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Test' };
      
      (categoryService.update as jest.Mock).mockResolvedValue(null);

      await updateCategory(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });
  });

  // Pruebas para el método deleteCategory
  describe('deleteCategory', () => {
    // Prueba eliminación exitosa
    it('should delete a category and return status 200', async () => {
      const mockDeletedCategory = { id: 1, name: 'Categoría', description: 'Descripción' };
      
      mockRequest.params = { id: '1' };
      
      // Simula que no hay productos asociados
      (categoryService.hasProducts as jest.Mock).mockResolvedValue(0);
      (categoryService.delete as jest.Mock).mockResolvedValue(mockDeletedCategory);

      await deleteCategory(mockRequest as Request, mockResponse as Response);

      expect(categoryService.hasProducts).toHaveBeenCalledWith(1);
      expect(categoryService.delete).toHaveBeenCalledWith(1);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Category deleted successfully' });
    });

    // Prueba cuando la categoría tiene productos asociados
    it('should return 400 if category has associated products', async () => {
      mockRequest.params = { id: '1' };
      
      // Simula que la categoría tiene 2 productos asociados
      (categoryService.hasProducts as jest.Mock).mockResolvedValue(2);

      await deleteCategory(mockRequest as Request, mockResponse as Response);

      expect(categoryService.hasProducts).toHaveBeenCalledWith(1);
      expect(categoryService.delete).not.toHaveBeenCalled(); // No debe llamar a delete
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({ 
        message: 'Cannot delete category. There are 2 products associated with it. Please reassign or delete these products first.' 
      });
    });

    // Prueba cuando la categoría a eliminar no existe
    it('should return 404 if category to delete not found', async () => {
      mockRequest.params = { id: '999' };
      
      (categoryService.hasProducts as jest.Mock).mockResolvedValue(0);
      (categoryService.delete as jest.Mock).mockResolvedValue(null);

      await deleteCategory(mockRequest as Request, mockResponse as Response);

      expect(categoryService.hasProducts).toHaveBeenCalledWith(999);
      expect(categoryService.delete).toHaveBeenCalledWith(999);
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ message: 'Category not found' });
    });
  });
});
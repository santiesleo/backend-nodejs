// Importaciones de los servicios y modelos necesarios
import { categoryService } from '../../services/category.service';
import Category from '../../models/category.model';
import Product from '../../models/product.model';

// Mock del modelo Category (simula las operaciones de base de datos)
jest.mock('../../models/category.model', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn()
}));

// Mock del modelo Product (necesario para verificar relaciones entre tablas)
jest.mock('../../models/product.model', () => ({
  count: jest.fn()
}));

// Bloque principal de pruebas para CategoryService
describe('CategoryService', () => {
  // Resetear todos los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Pruebas para el método findAll
  describe('findAll', () => {
    // Verifica que devuelva todas las categorías correctamente
    it('should return all categories', async () => {
      // Datos de ejemplo
      const mockCategories = [
        { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' },
        { id: 2, name: 'Ropa', description: 'Productos de vestir' }
      ];
      
      // Configura el mock para devolver los datos de ejemplo
      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      // Ejecuta el servicio
      const result = await categoryService.findAll();

      // Verifica que se llamó al método correcto y devolvió los datos esperados
      expect(Category.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    // Verifica el manejo de errores en findAll
    it('should handle errors', async () => {
      const error = new Error('Database error');
      (Category.findAll as jest.Mock).mockRejectedValue(error);

      // Verifica que el error se propaga correctamente
      await expect(categoryService.findAll()).rejects.toThrow('Database error');
    });
  });

  // Pruebas para el método findById
  describe('findById', () => {
    // Verifica que encuentre una categoría por su ID
    it('should return a category by id', async () => {
      const mockCategory = { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' };
      
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.findById(1);

      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    // Verifica que devuelva null si la categoría no existe
    it('should return null if category not found', async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.findById(999);

      expect(Category.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  // Pruebas para el método create
  describe('create', () => {
    // Verifica la creación exitosa de una categoría
    it('should create a new category', async () => {
      const categoryData = { name: 'Nueva Categoría', description: 'Descripción de la nueva categoría' };
      const mockCreatedCategory = { id: 3, ...categoryData, createdAt: new Date(), updatedAt: new Date() };
      
      (Category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

      const result = await categoryService.create(categoryData);

      expect(Category.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(mockCreatedCategory);
    });
  });

  // Pruebas para el método update
  describe('update', () => {
    // Verifica la actualización exitosa de una categoría
    it('should update an existing category', async () => {
      const categoryId = 1;
      const updateData = { name: 'Categoría Actualizada' };
      const mockUpdatedCategory = {
        id: categoryId,
        name: 'Categoría Actualizada',
        description: 'Descripción original'
      };
      
      // Simula que el método update de Sequelize devuelve un array con [filas afectadas, instancias]
      (Category.update as jest.Mock).mockResolvedValue([1, [mockUpdatedCategory]]);

      const result = await categoryService.update(categoryId, updateData);

      expect(Category.update).toHaveBeenCalledWith(updateData, {
        where: { id: categoryId },
        returning: true
      });
      expect(result).toEqual(mockUpdatedCategory);
    });

    // Verifica que devuelva null si la categoría a actualizar no existe
    it('should return null if category to update not found', async () => {
      // Simula que no se actualizó ninguna fila (0 filas afectadas)
      (Category.update as jest.Mock).mockResolvedValue([0, []]);

      const result = await categoryService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });
  });

  // Pruebas para el método hasProducts
  describe('hasProducts', () => {
    // Verifica que devuelva el número de productos asociados a una categoría
    it('should return number of products associated with category', async () => {
      const categoryId = 1;
      const mockCount = 5;
      
      (Product.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await categoryService.hasProducts(categoryId);
      
      expect(Product.count).toHaveBeenCalledWith({ where: { category_id: categoryId } });
      expect(result).toBe(mockCount);
    });
  });

  // Pruebas para el método delete
  describe('delete', () => {
    // Verifica la eliminación exitosa de una categoría
    it('should delete an existing category', async () => {
      const categoryId = 1;
      const mockCategory = {
        id: categoryId,
        name: 'Categoría a Eliminar',
        description: 'Descripción',
        // Mock del método destroy que Sequelize agrega a las instancias
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.delete(categoryId);

      expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
      expect(mockCategory.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    // Verifica que devuelva null si la categoría a eliminar no existe
    it('should return null if category to delete not found', async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.delete(999);

      expect(Category.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
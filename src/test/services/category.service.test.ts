import { categoryService } from '../../services/category.service';
import Category from '../../models/category.model';
import Product from '../../models/product.model';

// Mock del modelo Category
jest.mock('../../models/category.model', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn()
}));

// Mock del modelo Product
jest.mock('../../models/product.model', () => ({
  count: jest.fn()
}));

describe('CategoryService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all categories', async () => {
      const mockCategories = [
        { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' },
        { id: 2, name: 'Ropa', description: 'Productos de vestir' }
      ];
      
      (Category.findAll as jest.Mock).mockResolvedValue(mockCategories);

      const result = await categoryService.findAll();

      expect(Category.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockCategories);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (Category.findAll as jest.Mock).mockRejectedValue(error);

      await expect(categoryService.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return a category by id', async () => {
      const mockCategory = { id: 1, name: 'Electrónicos', description: 'Productos electrónicos' };
      
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.findById(1);

      expect(Category.findByPk).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCategory);
    });

    it('should return null if category not found', async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.findById(999);

      expect(Category.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a new category', async () => {
      const categoryData = { name: 'Nueva Categoría', description: 'Descripción de la nueva categoría' };
      const mockCreatedCategory = { id: 3, ...categoryData, createdAt: new Date(), updatedAt: new Date() };
      
      (Category.create as jest.Mock).mockResolvedValue(mockCreatedCategory);

      const result = await categoryService.create(categoryData);

      expect(Category.create).toHaveBeenCalledWith(categoryData);
      expect(result).toEqual(mockCreatedCategory);
    });
  });

  describe('update', () => {
    it('should update an existing category', async () => {
      const categoryId = 1;
      const updateData = { name: 'Categoría Actualizada' };
      const mockUpdatedCategory = {
        id: categoryId,
        name: 'Categoría Actualizada',
        description: 'Descripción original'
      };
      
      (Category.update as jest.Mock).mockResolvedValue([1, [mockUpdatedCategory]]);

      const result = await categoryService.update(categoryId, updateData);

      expect(Category.update).toHaveBeenCalledWith(updateData, {
        where: { id: categoryId },
        returning: true
      });
      expect(result).toEqual(mockUpdatedCategory);
    });

    it('should return null if category to update not found', async () => {
      (Category.update as jest.Mock).mockResolvedValue([0, []]);

      const result = await categoryService.update(999, { name: 'Test' });

      expect(result).toBeNull();
    });
  });

  describe('hasProducts', () => {
    it('should return number of products associated with category', async () => {
      const categoryId = 1;
      const mockCount = 5;
      
      (Product.count as jest.Mock).mockResolvedValue(mockCount);

      const result = await categoryService.hasProducts(categoryId);
      
      expect(Product.count).toHaveBeenCalledWith({ where: { category_id: categoryId } });
      expect(result).toBe(mockCount);
    });
  });

  describe('delete', () => {
    it('should delete an existing category', async () => {
      const categoryId = 1;
      const mockCategory = {
        id: categoryId,
        name: 'Categoría a Eliminar',
        description: 'Descripción',
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      
      (Category.findByPk as jest.Mock).mockResolvedValue(mockCategory);

      const result = await categoryService.delete(categoryId);

      expect(Category.findByPk).toHaveBeenCalledWith(categoryId);
      expect(mockCategory.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockCategory);
    });

    it('should return null if category to delete not found', async () => {
      (Category.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await categoryService.delete(999);

      expect(Category.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
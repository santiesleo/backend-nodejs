
import { productService } from '../../services/product.service';
import Product from '../../models/product.model';
import Category from '../../models/category.model';

// Mock del modelo Product
jest.mock('../../models/product.model', () => ({
  findAll: jest.fn(),
  findByPk: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn()
}));

// Mock del modelo Category
jest.mock('../../models/category.model', () => ({
  
}));

describe('ProductService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const mockProducts = [
        { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 },
        { id: 2, nombre: 'Teléfono', description: 'Un teléfono', price: 500, stock: 20, category_id: 1 }
      ];
      
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productService.findAll();

      expect(Product.findAll).toHaveBeenCalledWith({
        include: [{ model: Category, as: 'category' }]
      });
      expect(result).toEqual(mockProducts);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (Product.findAll as jest.Mock).mockRejectedValue(error);

      await expect(productService.findAll()).rejects.toThrow('Database error');
    });
  });

  describe('findById', () => {
    it('should return a product by id', async () => {
      const mockProduct = { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: 1 };
      
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.findById(1);

      expect(Product.findByPk).toHaveBeenCalledWith(1, {
        include: [{ model: Category, as: 'category' }]
      });
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product not found', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await productService.findById(999);

      expect(Product.findByPk).toHaveBeenCalledWith(999, {
        include: [{ model: Category, as: 'category' }]
      });
      expect(result).toBeNull();
    });
  });

  describe('findByCategory', () => {
    it('should return products by category id', async () => {
      const categoryId = 1;
      const mockProducts = [
        { id: 1, nombre: 'Laptop', description: 'Una laptop', price: 1000, stock: 10, category_id: categoryId },
        { id: 2, nombre: 'Teléfono', description: 'Un teléfono', price: 500, stock: 20, category_id: categoryId }
      ];
      
      (Product.findAll as jest.Mock).mockResolvedValue(mockProducts);

      const result = await productService.findByCategory(categoryId);

      expect(Product.findAll).toHaveBeenCalledWith({
        where: { category_id: categoryId },
        include: [{ model: Category, as: 'category' }]
      });
      expect(result).toEqual(mockProducts);
    });
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const productData = { nombre: 'Nuevo Producto', description: 'Descripción', price: 100, stock: 5, category_id: 1 };
      const mockCreatedProduct = { id: 3, ...productData, createdAt: new Date(), updatedAt: new Date() };
      
      (Product.create as jest.Mock).mockResolvedValue(mockCreatedProduct);

      const result = await productService.create(productData);

      expect(Product.create).toHaveBeenCalledWith(productData);
      expect(result).toEqual(mockCreatedProduct);
    });
  });

  describe('update', () => {
    it('should update an existing product', async () => {
      const productId = 1;
      const updateData = { price: 120, stock: 8 };
      const mockUpdatedProduct = {
        id: productId,
        nombre: 'Laptop',
        description: 'Una laptop',
        price: 120,
        stock: 8,
        category_id: 1
      };
      
      (Product.update as jest.Mock).mockResolvedValue([1, [mockUpdatedProduct]]);

      const result = await productService.update(productId, updateData);

      expect(Product.update).toHaveBeenCalledWith(updateData, {
        where: { id: productId },
        returning: true
      });
      expect(result).toEqual(mockUpdatedProduct);
    });

    it('should return null if product to update not found', async () => {
      (Product.update as jest.Mock).mockResolvedValue([0, []]);

      const result = await productService.update(999, { price: 120 });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete an existing product', async () => {
      const productId = 1;
      const mockProduct = {
        id: productId,
        nombre: 'Producto a Eliminar',
        description: 'Descripción',
        price: 1000,
        stock: 10,
        category_id: 1,
        destroy: jest.fn().mockResolvedValue(undefined)
      };
      
      (Product.findByPk as jest.Mock).mockResolvedValue(mockProduct);

      const result = await productService.delete(productId);

      expect(Product.findByPk).toHaveBeenCalledWith(productId);
      expect(mockProduct.destroy).toHaveBeenCalled();
      expect(result).toEqual(mockProduct);
    });

    it('should return null if product to delete not found', async () => {
      (Product.findByPk as jest.Mock).mockResolvedValue(null);

      const result = await productService.delete(999);

      expect(Product.findByPk).toHaveBeenCalledWith(999);
      expect(result).toBeNull();
    });
  });
});
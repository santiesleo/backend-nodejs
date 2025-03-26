import { DataTypes } from 'sequelize';

// Mock de Sequelize y Model
jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn(),
    define: jest.fn()
  };
  
  // Crear una clase Model mockeada
  class MockModel {
    public id?: number;
    public nombre?: string;
    public description?: string;
    public price?: number;
    public image?: string;
    public stock?: number;
    public category_id?: number;
    public readonly createdAt?: Date;
    public readonly updatedAt?: Date;
    
    static init = jest.fn();
    static belongsTo = jest.fn();
  }
  
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      TEXT: 'TEXT',
      DECIMAL: jest.fn().mockReturnValue('DECIMAL'),
      DATE: 'DATE'
    },
    Model: MockModel
  };
});

// Mock del config/database
jest.mock('../../config/database', () => ({
  __esModule: true,
  default: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn().mockReturnValue({})
  }
}));

// Mock del modelo Category
jest.mock('../../models/category.model', () => ({
  __esModule: true,
  default: 'MockedCategoryModel'
}));

// Importar después de mockear
import { Product } from '../../models/product.model';
import Category from '../../models/category.model';

describe('Product Model', () => {
  it('should have the correct model name', () => {
    expect(Product).toBeDefined();
  });

  it('should call Model.init with the correct parameters', () => {
    // Verificar que Model.init fue llamado
    expect(require('sequelize').Model.init).toHaveBeenCalled();
    
    // Obtener los argumentos con los que se llamó Model.init
    const initArgs = require('sequelize').Model.init.mock.calls[0];
    
    // Verificar que se pasaron los atributos correctos
    expect(initArgs[0]).toHaveProperty('id');
    expect(initArgs[0]).toHaveProperty('nombre');
    expect(initArgs[0]).toHaveProperty('description');
    expect(initArgs[0]).toHaveProperty('price');
    expect(initArgs[0]).toHaveProperty('image');
    expect(initArgs[0]).toHaveProperty('stock');
    expect(initArgs[0]).toHaveProperty('category_id');
    
    // Verificar las propiedades de los atributos
    expect(initArgs[0].id).toHaveProperty('type', 'INTEGER');
    expect(initArgs[0].id).toHaveProperty('autoIncrement', true);
    expect(initArgs[0].id).toHaveProperty('primaryKey', true);
    
    expect(initArgs[0].nombre).toHaveProperty('type', 'STRING');
    expect(initArgs[0].nombre).toHaveProperty('allowNull', false);
    
    expect(initArgs[0].description).toHaveProperty('type', 'TEXT');
    expect(initArgs[0].description).toHaveProperty('allowNull', false);
    
    expect(initArgs[0].price).toHaveProperty('type', 'DECIMAL');
    expect(initArgs[0].price).toHaveProperty('allowNull', false);
    expect(initArgs[0].price).toHaveProperty('validate');
    expect(initArgs[0].price.validate).toHaveProperty('min', 0);
    
    expect(initArgs[0].image).toHaveProperty('type', 'STRING');
    expect(initArgs[0].image).toHaveProperty('allowNull', true);
    expect(initArgs[0].image).toHaveProperty('defaultValue', '');
    
    expect(initArgs[0].stock).toHaveProperty('type', 'INTEGER');
    expect(initArgs[0].stock).toHaveProperty('allowNull', false);
    expect(initArgs[0].stock).toHaveProperty('defaultValue', 0);
    expect(initArgs[0].stock).toHaveProperty('validate');
    expect(initArgs[0].stock.validate).toHaveProperty('min', 0);
    
    expect(initArgs[0].category_id).toHaveProperty('type', 'INTEGER');
    expect(initArgs[0].category_id).toHaveProperty('allowNull', false);
    expect(initArgs[0].category_id).toHaveProperty('references');
    expect(initArgs[0].category_id.references).toHaveProperty('model', 'categories');
    expect(initArgs[0].category_id.references).toHaveProperty('key', 'id');
    
    // Verificar las opciones
    expect(initArgs[1]).toHaveProperty('tableName', 'products');
    expect(initArgs[1]).toHaveProperty('modelName', 'Product');
    expect(initArgs[1]).toHaveProperty('timestamps', true);
  });

  it('should establish a belongsTo relationship with Category', () => {
    // Verificar que Product.belongsTo fue llamado con los parámetros correctos
    expect(require('sequelize').Model.belongsTo).toHaveBeenCalledWith(
      'MockedCategoryModel',
      { foreignKey: 'category_id', as: 'category' }
    );
  });
});
import { DataTypes } from 'sequelize';

// Mock de Sequelize y Model
jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn(),
    define: jest.fn()
  };
  
  const Model = function() {};
  Model.init = jest.fn();
  
  return {
    Sequelize: jest.fn(() => mSequelize),
    DataTypes: {
      INTEGER: 'INTEGER',
      STRING: 'STRING',
      TEXT: 'TEXT',
      DATE: 'DATE'
    },
    Model
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

// Importar después de mockear
import { Category } from '../../models/category.model';

describe('Category Model', () => {
  it('should have the correct model name', () => {
    expect(Category).toBeDefined();
  });

  it('should call Model.init with the correct parameters', () => {
    // Verificar que Model.init fue llamado
    expect(require('sequelize').Model.init).toHaveBeenCalled();
    
    // Obtener los argumentos con los que se llamó Model.init
    const initArgs = require('sequelize').Model.init.mock.calls[0];
    
    // Verificar que se pasaron los atributos correctos
    expect(initArgs[0]).toHaveProperty('id');
    expect(initArgs[0]).toHaveProperty('name');
    expect(initArgs[0]).toHaveProperty('description');
    
    // Verificar las propiedades de los atributos
    expect(initArgs[0].id).toHaveProperty('type', 'INTEGER');
    expect(initArgs[0].id).toHaveProperty('autoIncrement', true);
    expect(initArgs[0].id).toHaveProperty('primaryKey', true);
    
    expect(initArgs[0].name).toHaveProperty('type', 'STRING');
    expect(initArgs[0].name).toHaveProperty('allowNull', false);
    expect(initArgs[0].name).toHaveProperty('unique', true);
    
    expect(initArgs[0].description).toHaveProperty('type', 'TEXT');
    expect(initArgs[0].description).toHaveProperty('allowNull', false);
    
    // Verificar las opciones
    expect(initArgs[1]).toHaveProperty('tableName', 'categories');
    expect(initArgs[1]).toHaveProperty('modelName', 'Category');
    expect(initArgs[1]).toHaveProperty('timestamps', true);
  });
});
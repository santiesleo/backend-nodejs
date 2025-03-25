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
jest.mock('../config/database', () => ({
  default: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn().mockReturnValue({})
  }
}));



import Category from '../../models/category.model';

describe('Category Model', () => {
  it('should have the correct model definition', () => {
    expect(Category).toBeDefined();
  });
  
  // Opcional: Agregar alguna verificación más si lo deseas
  it('should have a tableName property', () => {
    expect(Category.tableName).toBe('categories');
  });
});
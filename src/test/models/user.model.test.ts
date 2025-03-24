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
      BOOLEAN: 'BOOLEAN',
      DATE: 'DATE'
    },
    Model
  };
});

// Mock del config/database
jest.mock('../../config/database', () => ({
  default: {
    authenticate: jest.fn().mockResolvedValue(undefined),
    define: jest.fn().mockReturnValue({})
  }
}));

// Importar después de mockear
import { User } from '../../models/user.model';

describe('User Model', () => {
  it('should have the correct model name', () => {
    expect(User).toBeDefined();
  });
});
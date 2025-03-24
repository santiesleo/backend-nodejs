import { Request, Response } from 'express';
import { userController } from '../../controllers/user.controller';
import { AuthError } from '../../exceptions';
import { mockUserData, mockUserInput } from '../mocks/user.mock';

// Mock de userService
jest.mock('../../services/user.service', () => ({
  userService: {
    create: jest.fn(),
    login: jest.fn(),
    findById: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}));

// Importar el servicio después de mockearlo
import { userService } from '../../services/user.service';

describe('UserController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObj = {
    statusCode: 0,
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockImplementation(code => {
      responseObj.statusCode = code;
      return responseObj;
    })
  };

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {}
    };
    mockResponse = responseObj;
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a user and return 201 status', async () => {
      // Configurar request
      mockRequest.body = mockUserInput;
      
      // Mock de userService.create
      (userService.create as jest.Mock).mockResolvedValue(mockUserData);

      // Ejecutar controlador
      await userController.create(mockRequest as Request, mockResponse as Response);

      // Verificar resultado
      expect(userService.create).toHaveBeenCalledWith(mockUserInput);
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });

    it('should return 400 status if user already exists', async () => {
      // Configurar request
      mockRequest.body = mockUserInput;
      
      // Mock de userService.create para que lance un error
      const error = new ReferenceError("User already exists");
      (userService.create as jest.Mock).mockRejectedValue(error);

      // Ejecutar controlador
      await userController.create(mockRequest as Request, mockResponse as Response);

      // Verificar resultado
      expect(userService.create).toHaveBeenCalledWith(mockUserInput);
      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({message: "User already exists"});
    });
  });

  describe('login', () => {
    it('should return 200 and user data when login is successful', async () => {
      // Configurar request
      mockRequest.body = {
        email: mockUserInput.email,
        password: mockUserInput.password
      };
      
      // Mock de userService.login
      const loginResponse = {
        user: {
          id: mockUserData.id,
          name: mockUserData.name,
          email: mockUserData.email,
          roles: ["admin"],
          token: 'fake_token'
        }
      };
      (userService.login as jest.Mock).mockResolvedValue(loginResponse);

      // Ejecutar controlador
      await userController.login(mockRequest as Request, mockResponse as Response);

      // Verificar resultado
      expect(userService.login).toHaveBeenCalledWith(mockRequest.body);
      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith(loginResponse);
    });
  });

  describe('get', () => {
    it('should return a user when found by ID', async () => {
      // Configurar request
      mockRequest.params = { id: '1' };
      
      // Mock de userService.findById
      (userService.findById as jest.Mock).mockResolvedValue(mockUserData);
  
      // Ejecutar controlador
      await userController.get(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.findById).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });
  
    it('should return 404 when user not found', async () => {
      // Configurar request
      mockRequest.params = { id: '999' };
      
      // Mock de userService.findById
      (userService.findById as jest.Mock).mockResolvedValue(null);
  
      // Ejecutar controlador
      await userController.get(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.findById).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('not found')
      }));
    });
  });
  
  describe('getAll', () => {
    it('should return all users', async () => {
      // Mock de userService.findAll
      (userService.findAll as jest.Mock).mockResolvedValue([mockUserData]);
  
      // Ejecutar controlador
      await userController.getAll(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.findAll).toHaveBeenCalled();
      expect(mockResponse.json).toHaveBeenCalledWith([mockUserData]);
    });
  
    it('should handle errors', async () => {
      // Mock de userService.findAll
      const error = new Error('Database error');
      (userService.findAll as jest.Mock).mockRejectedValue(error);
  
      // Ejecutar controlador
      await userController.getAll(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.findAll).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith(error);
    });
  });
  
  describe('update', () => {
    it('should update a user successfully', async () => {
      // Configurar request
      mockRequest.params = { id: '1' };
      mockRequest.body = { name: 'Updated Name' };
      
      // Mock de userService.update
      const updatedUser = { ...mockUserData, name: 'Updated Name' };
      (userService.update as jest.Mock).mockResolvedValue(updatedUser);
  
      // Ejecutar controlador
      await userController.update(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.update).toHaveBeenCalledWith('1', { name: 'Updated Name' });
      expect(mockResponse.json).toHaveBeenCalledWith(updatedUser);
    });
  
    it('should return 404 when updating non-existent user', async () => {
      // Configurar request
      mockRequest.params = { id: '999' };
      mockRequest.body = { name: 'Updated Name' };
      
      // Mock de userService.update
      (userService.update as jest.Mock).mockResolvedValue(null);
  
      // Ejecutar controlador
      await userController.update(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.update).toHaveBeenCalledWith('999', { name: 'Updated Name' });
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('not found')
      }));
    });
  });
  
  describe('delete', () => {
    it('should delete a user successfully', async () => {
      // Configurar request
      mockRequest.params = { id: '1' };
      
      // Mock de userService.delete
      (userService.delete as jest.Mock).mockResolvedValue(mockUserData);
  
      // Ejecutar controlador
      await userController.delete(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.delete).toHaveBeenCalledWith('1');
      expect(mockResponse.json).toHaveBeenCalledWith(mockUserData);
    });
  
    it('should return 404 when deleting non-existent user', async () => {
      // Configurar request
      mockRequest.params = { id: '999' };
      
      // Mock de userService.delete
      (userService.delete as jest.Mock).mockResolvedValue(null);
  
      // Ejecutar controlador
      await userController.delete(mockRequest as Request, mockResponse as Response);
  
      // Verificar resultado
      expect(userService.delete).toHaveBeenCalledWith('999');
      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        message: expect.stringContaining('not found')
      }));
    });
  });
});
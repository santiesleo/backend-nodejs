import { Request, Response, NextFunction } from 'express';
import { auth } from '../../middlewares/auth.middleware';
import jwt from 'jsonwebtoken';
import { TokenExpiredError } from 'jsonwebtoken';

// Mock de jwt
jest.mock('jsonwebtoken');

describe('Auth Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction = jest.fn();
  let responseObj: { statusCode: number; json: jest.Mock; status: jest.Mock } = {
    statusCode: 0,
    json: jest.fn().mockReturnThis(),
    status: jest.fn().mockImplementation(code => {
      responseObj.statusCode = code;
      return responseObj;
    })
  };

  beforeEach(() => {
    mockRequest = {
      header: jest.fn(),
      body: {},
      params: {} as Record<string, string> // Ensure params is initialized as an empty object
    };

    responseObj = {
      statusCode: 0,
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockImplementation(code => {
        responseObj.statusCode = code;
        return responseObj;
      })
    };
    mockResponse = responseObj;
    
    nextFunction = jest.fn();
    jest.clearAllMocks();
  });

  it('should call next() if token is valid', () => {
    // Setup
    const mockToken = 'Bearer validToken';
    const mockDecodedToken = { 
      user: { id: '1', email: 'test@example.com', name: 'Test User' }
    };
    
    (mockRequest.header as jest.Mock).mockReturnValue(mockToken);
    (jwt.verify as jest.Mock).mockReturnValue(mockDecodedToken);

    // Execute
    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith('validToken', expect.any(String));
    expect(mockRequest.body.loggedUser).toEqual(mockDecodedToken);
    expect(nextFunction).toHaveBeenCalled();
  });

  it('should return 401 status if no token is provided', () => {
    // Setup
    (mockRequest.header as jest.Mock).mockReturnValue(undefined);

    // Execute
    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith('Not Authorized');
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 status if token is expired', () => {
    // Setup
    const mockToken = 'Bearer expiredToken';
    const error = new TokenExpiredError('jwt expired', new Date());
    
    (mockRequest.header as jest.Mock).mockReturnValue(mockToken);
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw error;
    });

    // Execute
    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith('expiredToken', expect.any(String));
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith('Token Expired');
    expect(nextFunction).not.toHaveBeenCalled();
  });

  it('should return 401 status for invalid token', () => {
    // Setup
    const mockToken = 'Bearer invalidToken';
    
    (mockRequest.header as jest.Mock).mockReturnValue(mockToken);
    (jwt.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    // Execute
    auth(mockRequest as Request, mockResponse as Response, nextFunction);

    // Assert
    expect(mockRequest.header).toHaveBeenCalledWith('Authorization');
    expect(jwt.verify).toHaveBeenCalledWith('invalidToken', expect.any(String));
    expect(mockResponse.status).toHaveBeenCalledWith(401);
    expect(mockResponse.json).toHaveBeenCalledWith('Not Authorized');
    expect(nextFunction).not.toHaveBeenCalled();
  });
});
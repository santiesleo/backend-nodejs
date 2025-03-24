export const mockSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
    sync: jest.fn().mockResolvedValue(undefined),
    transaction: jest.fn().mockImplementation(callback => callback())
  };
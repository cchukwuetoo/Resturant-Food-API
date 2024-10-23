const supertest = require("supertest");
const mongoose = require('mongoose')
const { registerController, loginController } = require('../controllers/authController');
const userModel = require('../models/userModel');
const JWT = require('jsonwebtoken');



// Mock dependencies
jest.mock('../models/userModel');
jest.mock('jsonwebtoken');

// Mock Express request and response
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

const mockRequest = (body = {}) => ({
  body,
});

describe('Authentication Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('registerController', () => {
    const validRegisterData = {
      userName: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      phone: '1234567890',
      address: '123 Test St',
      answer: 'test answer'
    };

    it('should successfully register a new user', async () => {
      // Mock userModel.findOne to return null (user doesn't exist)
      userModel.findOne.mockResolvedValue(null);
      // Mock userModel.create to return the new user
      userModel.create.mockResolvedValue(validRegisterData);

      const req = mockRequest(validRegisterData);
      const res = mockResponse();

      await registerController(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        succes: true,
        message: 'Successfully Registered',
      });
    });

    it('should return error if required fields are missing', async () => {
      const req = mockRequest({ email: 'test@example.com' }); // Missing other required fields
      const res = mockResponse();

      await registerController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Please Provide All Fields'
      });
    });

    it('should return error if email already exists', async () => {
      // Mock userModel.findOne to return an existing user
      userModel.findOne.mockResolvedValue(validRegisterData);

      const req = mockRequest(validRegisterData);
      const res = mockResponse();

      await registerController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Email Already Registed Please Login'
      });
    });

    it('should handle server errors during registration', async () => {
      // Mock userModel.findOne to throw an error
      userModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = mockRequest(validRegisterData);
      const res = mockResponse();

      await registerController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Error In Register API',
        error: expect.any(Error),
      });
    });
  });

  describe('loginController', () => {
    const validLoginData = {
      email: 'test@example.com',
      password: 'password123'
    };

    const mockUser = {
      _id: 'mockUserId',
      email: 'test@example.com',
      password: 'hashedPassword',
    };

    beforeEach(() => {
      process.env.JWT_SECRET = 'test-secret';
    });

    it('should successfully login a user', async () => {
      // Mock userModel.findOne to return a user
      userModel.findOne.mockResolvedValue(mockUser);
      // Mock JWT.sign to return a token
      JWT.sign.mockReturnValue('mockToken');

      const req = mockRequest(validLoginData);
      const res = mockResponse();

      await loginController(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        succes: true,
        message: 'Login Successful',
        token: 'mockToken',
        user: expect.objectContaining({
          _id: mockUser._id,
          email: mockUser.email,
        }),
      });
      expect(JWT.sign).toHaveBeenCalledWith(
        { id: mockUser._id },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
    });

    it('should return error if email or password is missing', async () => {
      const req = mockRequest({ email: 'test@example.com' }); // Missing password
      const res = mockResponse();

      await loginController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Invalid Login Details'
      });
    });

    it('should return error if user is not found', async () => {
      // Mock userModel.findOne to return null (user not found)
      userModel.findOne.mockResolvedValue(null);

      const req = mockRequest(validLoginData);
      const res = mockResponse();

      await loginController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'User Not Found'
      });
    });

    it('should handle server errors during login', async () => {
      // Mock userModel.findOne to throw an error
      userModel.findOne.mockRejectedValue(new Error('Database error'));

      const req = mockRequest(validLoginData);
      const res = mockResponse();

      await loginController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: 'Error In Login API',
        error: expect.any(Error),
      });
    });
  });
});
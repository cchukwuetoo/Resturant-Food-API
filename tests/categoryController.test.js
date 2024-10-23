const mongoose = require('mongoose');
const categoryModel = require('../models/categoryModel');
const {
  createCatController,
  getAllCatController,
  updateCatController,
  deleteCatController
} = require('../controllers/categoryController');

// Mock categoryModel
jest.mock('../models/categoryModel');

// Mock response object
const mockResponse = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res;
};

// Mock request object
const mockRequest = (body = {}, params = {}) => ({
  body,
  params
});

describe('Category Controllers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createCatController', () => {
    const validCategoryData = {
      title: 'Test Category',
      imageUrl: 'http://example.com/image.jpg'
    };

    it('should successfully create a category', async () => {
      // Mock save method
      const mockSave = jest.fn();
      categoryModel.mockImplementation(() => ({
        save: mockSave
      }));
      mockSave.mockResolvedValue(validCategoryData);

      const req = mockRequest(validCategoryData);
      const res = mockResponse();

      await createCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Category Created",
        newCategory: expect.any(Object)
      });
    });

    it('should return error if title or imageUrl is missing', async () => {
      const req = mockRequest({ title: 'Test Category' }); // Missing imageUrl
      const res = mockResponse();

      await createCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Please Provide Category Title or Image"
      });
    });

    it('should handle server errors during category creation', async () => {
      const mockSave = jest.fn();
      categoryModel.mockImplementation(() => ({
        save: mockSave
      }));
      mockSave.mockRejectedValue(new Error('Database error'));

      const req = mockRequest(validCategoryData);
      const res = mockResponse();

      await createCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Error in Creating Category API",
        error: expect.any(Error)
      });
    });
  });

  describe('getAllCatController', () => {
    it('should successfully get all categories', async () => {
      const mockCategories = [
        { _id: '1', title: 'Category 1', imageUrl: 'url1' },
        { _id: '2', title: 'Category 2', imageUrl: 'url2' }
      ];
      
      categoryModel.find.mockResolvedValue(mockCategories);

      const req = mockRequest();
      const res = mockResponse();

      await getAllCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        totalCat: mockCategories.length,
        categories: mockCategories
      });
    });

    it('should handle when no categories are found', async () => {
      categoryModel.find.mockResolvedValue(null);

      const req = mockRequest();
      const res = mockResponse();

      await getAllCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should handle server errors when getting categories', async () => {
      categoryModel.find.mockRejectedValue(new Error('Database error'));

      const req = mockRequest();
      const res = mockResponse();

      await getAllCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Error Getting All Category",
        error: expect.any(Error)
      });
    });
  });

  describe('updateCatController', () => {
    const updateData = {
      title: 'Updated Category',
      imageUrl: 'http://example.com/new-image.jpg'
    };

    it('should successfully update a category', async () => {
      categoryModel.findByIdAndUpdate.mockResolvedValue({
        _id: '123',
        ...updateData
      });

      const req = mockRequest(updateData, { id: '123' });
      const res = mockResponse();

      await updateCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Category Updated Successfully"
      });
    });

    it('should handle when category is not found for update', async () => {
      categoryModel.findByIdAndUpdate.mockResolvedValue(null);

      const req = mockRequest(updateData, { id: 'nonexistent' });
      const res = mockResponse();

      await updateCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });

    it('should handle server errors during update', async () => {
      categoryModel.findByIdAndUpdate.mockRejectedValue(new Error('Database error'));

      const req = mockRequest(updateData, { id: '123' });
      const res = mockResponse();

      await updateCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Error Updating Category",
        error: expect.any(Error)
      });
    });
  });

  describe('deleteCatController', () => {
    it('should successfully delete a category', async () => {
      categoryModel.findById.mockResolvedValue({ _id: '123', title: 'Test Category' });
      categoryModel.findByIdAndDelete.mockResolvedValue(true);

      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      await deleteCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        success: true,
        message: "Category Deleted Sucessfully"
      });
    });

    it('should return error if category ID is not provided', async () => {
      const req = mockRequest({}, {});
      const res = mockResponse();

      await deleteCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Please Provide Catergory ID"
      });
    });

    it('should handle when category is not found for deletion', async () => {
      categoryModel.findById.mockResolvedValue(null);

      const req = mockRequest({}, { id: 'nonexistent' });
      const res = mockResponse();

      await deleteCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "No Category Found With this ID"
      });
    });

    it('should handle server errors during deletion', async () => {
      categoryModel.findById.mockRejectedValue(new Error('Database error'));

      const req = mockRequest({}, { id: '123' });
      const res = mockResponse();

      await deleteCatController(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith({
        success: false,
        message: "Error Deleting Category",
        error: expect.any(Error)
      });
    });
  });
});
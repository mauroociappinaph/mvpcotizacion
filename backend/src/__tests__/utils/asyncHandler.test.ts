import { asyncHandler } from '../../utils/asyncHandler';
import { Request, Response, NextFunction } from 'express';

describe('asyncHandler utility', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: jest.Mock<NextFunction>;

  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  it('should pass the error to next if the handler throws', async () => {
    const error = new Error('Test error');
    const handler = jest.fn().mockRejectedValue(error);

    const wrappedHandler = asyncHandler(handler);
    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(handler).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).toHaveBeenCalledWith(error);
  });

  it('should resolve successfully if no error is thrown', async () => {
    const handler = jest.fn().mockResolvedValue('result');

    const wrappedHandler = asyncHandler(handler);
    await wrappedHandler(
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(handler).toHaveBeenCalledWith(
      mockRequest,
      mockResponse,
      nextFunction
    );
    expect(nextFunction).not.toHaveBeenCalled();
  });
});

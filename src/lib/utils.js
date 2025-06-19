
 import rateLimit from 'express-rate-limit';
import { ApiError } from './apiError.js';
import { ApiResponse } from './apiResponse.js';

export const rateLimiter = (maxAttempts, windowMs) => 
  rateLimit({
    windowMs,
    max: maxAttempts,
    handler: (req, res) => {
        const response = new ApiError(429,{}, `Too many attempts, please try again after ${windowMs/60000} minutes`)
      return res
        .status(response.statusCode)
        .json(response)
    }
  });
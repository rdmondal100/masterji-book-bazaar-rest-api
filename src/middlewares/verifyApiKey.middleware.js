 import { ApiError } from '../lib/apiError.js';
import { ApiKey } from '../models/apikey.model.js';
 
export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new ApiError(401,'API key required'));
  }

  try {
    const validKey = await ApiKey.findOne({ key: apiKey });
    if (!validKey) {
      return next(new ApiError(401,'Invalid API key'));
    }
    req.user = { id: validKey.user };
    next();
  } catch (err) {
    return next(new ApiError(401,'Invalid API key'));
  }
};
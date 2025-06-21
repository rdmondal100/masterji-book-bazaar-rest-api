 import { ApiError } from '../lib/apiError.js';
import { ApiKey } from '../models/apikey.model.js';
 
export const verifyApiKey = async (req, res, next) => {
  const apiKey = req.headers['x-api-key'];

  if (!apiKey) {
    return next(new ApiError(401,'API key required'));
  }

  try {
    const validKey = await ApiKey.findOne({ key: apiKey });
    console.log("validKey")
    console.log(validKey)
    if (!validKey) {
      return next(new ApiError(401,'Invalid API key'));
    }
    console.log("validKey")
    console.log(validKey._id.toString())
    console.log(req.user.apiKey.toString())
    
    if(validKey._id.toString() !== req.user.apiKey.toString()){
      throw new ApiError(403,"Unauthorized or expire api key for the user")
    }

    next();
  } catch (err) {
    return next(new ApiError(401,'Invalid API key'));
  }
};
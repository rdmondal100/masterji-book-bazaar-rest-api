import { ApiError } from "../lib/apiError.js";

 
export const checkIsAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return next(new ApiError(403,'Admin access required'));
  }
};

import { body, query } from "express-validator";

export const addBookValidator = () => {
  return [
    body("title")
      .trim()
      .notEmpty().withMessage("Title is required")
      .isLength({ min: 2 }).withMessage("Title must be at least 2 characters long"),

    body("author")
      .trim()
      .notEmpty().withMessage("Author is required"),

    body("description")
      .trim()
      .notEmpty().withMessage("Description is required"),

    body("price")
      .notEmpty().withMessage("Price is required")
      .isFloat({ min: 0 }).withMessage("Price must be a number >= 0"),

    body("stock")
      .optional()
      .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    body("genre")
      .optional()
      .isString().withMessage("Genre must be a string"),

    body("coverImage")
      .optional()
      .isURL().withMessage("Cover Image must be a valid URL"),

    body("averageRating")
      .optional()
      .isFloat({ min: 0, max: 5 }).withMessage("Average rating must be between 0 and 5"),
  ];
};




export const getBooksValidator = () => {
  return [
    query("page")
      .optional()
      .isInt({ min: 1 }).withMessage("Page must be at least 1"),

    query("limit")
      .optional()
      .isInt({ min: 1 }).withMessage("Limit must be at least 1"),

    query("sort")
      .optional()
      .isString().withMessage("Sort must be a string"),

    query("price")
      .optional()
      .isObject().withMessage("Price must be an object (e.g., price[gte]=100)")
  ];
};


export const updateBookValidator = () => {
  return [
    body("title")
      .optional()
      .isLength({ min: 2 }).withMessage("Title must be at least 2 characters"),

    body("author")
      .optional()
      .isString().withMessage("Author must be a string"),

    body("description")
      .optional()
      .isString().withMessage("Description must be a string"),

    body("price")
      .optional()
      .isFloat({ min: 0 }).withMessage("Price must be a number >= 0"),

    body("stock")
      .optional()
      .isInt({ min: 0 }).withMessage("Stock must be a non-negative integer"),

    body("genre")
      .optional()
      .isString().withMessage("Genre must be a string"),

    body("coverImage")
      .optional()
      .isURL().withMessage("Cover Image must be a valid URL"),

    body("averageRating")
      .optional()
      .isFloat({ min: 0, max: 5 }).withMessage("Average rating must be between 0 and 5"),
  ];
};

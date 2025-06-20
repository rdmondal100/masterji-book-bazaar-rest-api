import { body, param } from "express-validator";

export const validateAddReview = () => {
  return [
    param("bookId").isMongoId().withMessage("Invalid book ID in params"),

    body("rating")
      .isFloat({ min: 1, max: 5 })
      .withMessage("Rating must be a number between 1 and 5"),

    body("comment")
      .optional()
      .isString()
      .trim()
      .withMessage("Comment must be a string"),
  ];
};

export const validateGetAllReviewsForBook = () => {
  return [param("bookId").isMongoId().withMessage("Invalid book ID in params")];
};

export const validateDeleteReview = () => {
  return [param("id").isMongoId().withMessage("Invalid review ID in params")];
};

import { body } from "express-validator";

const UserRole = {
    USER:"User",
    ADMIN:"Admin"
}

export const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
    ,
    body("fullName")
      .trim()
      .notEmpty()
      .withMessage("Full name is required")
      .isLength({ min: 2 })
      .withMessage("Name must be more than two charecter"),
    body("role")
      .optional()
      .isIn(Object.values(UserRole))
      .withMessage(`Role must be one of: ${Object.values(UserRole).join(", ")}`)



  ];
};



export const userLoginValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),
    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long")
      
  ]
}

export const apiKeyValidator = () => {
  return [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .matches(/^[A-Za-z\s'-]{2,30}$/)
      .withMessage("Name must contain only letters, spaces, apostrophes, or hyphens and be 2-30 characters long")
  ]
}
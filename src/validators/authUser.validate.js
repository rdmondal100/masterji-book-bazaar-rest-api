
const UserRole = {
    USER:"User",
    ADMIN:"Admin"
}

const userRegisterValidator = () => {
  return [
    body("username")
      .trim()
      .notEmpty()
      .withMessage("Username is required")
      .isLength({min:2})
      .withMessage("Username must be at least 2 characters")
    ,
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

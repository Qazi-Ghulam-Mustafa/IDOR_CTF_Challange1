import express from "express";
import { body } from "express-validator";

import {
  registerUser,
  loginUser,
  logoutUser,
} from "../controllers/authController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

// Registration route
router.post(
  "/register",
  [
    body("username")
      .isString()
      .withMessage("Username must be text")
      .bail()
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),

    body("email")
      .isString()
      .withMessage("Email must be text")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

    body("password")
      .isString()
      .withMessage("Password must be text")
      .bail()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  registerUser,
);

// Login route
router.post(
  "/login",
  [
    body("email")
      .isString()
      .withMessage("Email must be text")
      .bail()
      .trim()
      .isEmail()
      .withMessage("Enter a valid email address")
      .normalizeEmail(),

   body("password")
  .isString()
  .withMessage("Password must be text")
  .bail()
  .notEmpty()
  .withMessage("Password is required"),
  ],
  loginUser,
);

router.get("/me", isAuthenticated, (req, res) => {
  res.status(200).json({
    success: true,
    message: "User is authenticated!",
    user: req.session.user,
  });
});

router.post("/logout", isAuthenticated, logoutUser);

export default router;

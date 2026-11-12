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
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage("Username must be 3-30 characters"),

    body("email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Enter a valid email address"),

    body("password")
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
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Enter a valid email address"),

    body("password").notEmpty().withMessage("Password is required"),
  ],
  loginUser,
);


router.get('/me', isAuthenticated, (req, res) => {
    res.status(200).json({
        success: true,
        message: 'User is authenticated!',
        user: req.session.user
    });
});


router.post('/logout', isAuthenticated, logoutUser);

export default router;

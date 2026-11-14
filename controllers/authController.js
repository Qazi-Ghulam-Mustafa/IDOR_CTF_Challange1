import db from "../config/database.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

export const registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }

    const existingUser = db
      .prepare(
        `
            SELECT id FROM users WHERE email = ?
        `,
      )
      .get(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: "Email already registered!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = db
      .prepare(
        `
            INSERT INTO users
            (username, email, password_hash)
            VALUES (?, ?, ?)
        `,
      )
      .run(username, email, hashedPassword);

    return res.status(201).json({
      success: true,
      message: "Registration successful!",
      user: {
        id: result.lastInsertRowid,
        username,
        email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { password } = req.body;
    const email = req.body.email?.trim().toLowerCase();

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      });
    }
    const user = db
      .prepare(
        `
            SELECT id, username,email,password_hash
            FROM users
            WHERE email=?
        `,
      )
      .get(email);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password_hash,
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password!",
      });
    }

    // Regenerate session after successful login
    await new Promise((resolve, reject) => {
      req.session.regenerate((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    // Store authenticated user information
    req.session.user = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    // Save session before responding
    await new Promise((resolve, reject) => {
      req.session.save((error) => {
        if (error) reject(error);
        else resolve();
      });
    });

    return res.status(200).json({
      success: true,
      message: "Login successful! Session created.",
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal server error!",
    });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.error("Logout error", error);

      return res.status(500).json({
        success: false,
        message: "Could not logout",
      });
    }

    res.clearCookie("idor.sid", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
    });
    return res.status(200).json({
      success: true,
      message: "Logout successfully.",
    });
  });
};

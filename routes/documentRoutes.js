
import express from "express";

import { isAuthenticated } from "../middleware/authMiddleware.js";

import {
  getSecureDocument,
} from "../controllers/secureDocumentController.js";

const router = express.Router();


router.get("/:id", isAuthenticated, getSecureDocument);

export default router;

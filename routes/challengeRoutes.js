import express from "express";
import {
  getPlainIdorDocument,
  getEncodedIdorDocument,
} from "../controllers/challengeController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/plain-idor/documents/:id", isAuthenticated, getPlainIdorDocument);

router.get(
  "/encoded-idor/documents/:encodedId",
  isAuthenticated,
  getEncodedIdorDocument,
);

export default router;

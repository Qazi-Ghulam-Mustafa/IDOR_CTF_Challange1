import express from "express";
import {
  getPlainIdorDocument,
  getEncodedIdorDocument,
  getChallenges,
  submitFlag,
} from "../controllers/challengeController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/plain-idor/documents/:id", isAuthenticated, getPlainIdorDocument);

router.get(
  "/encoded-idor/documents/:encodedId",
  isAuthenticated,
  getEncodedIdorDocument,
);

router.get("/", isAuthenticated, getChallenges);

router.post("/:slug/submit", isAuthenticated, submitFlag);

export default router;

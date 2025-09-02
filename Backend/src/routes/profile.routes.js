import express from "express";
import { createOrUpdateProfile, getMyProfile } from "../controllers/profile.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../utils/multerConfig.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Profile } from "../models/profile.models.js";
import path from "path";
import fs from "fs";

const router = express.Router();

router.post("/", verifyJWT, upload.single("resume"), createOrUpdateProfile);

router.get("/", verifyJWT, getMyProfile);

router.get("/resume", verifyJWT, asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id });

  if (!profile || !profile.resume) {
    return res.status(404).send("Resume not found");
  }

  const normalizedPath = path.resolve("uploads", path.basename(profile.resume));

  if (!fs.existsSync(normalizedPath)) {
    return res.status(404).send("Resume file is missing on server");
  }

  res.download(normalizedPath, profile.resumeName || "resume.pdf"); 
}));

export default router;
import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  refreshAccessToken,
  resetPasswordViaOtp,
  sendOtpToPhone,
  changeCurrentPassword,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);
router.post("/change-password", verifyJWT, changeCurrentPassword);
router.post("/forgot-password/send-otp", sendOtpToPhone);
router.post("/forgot-password/verify-and-reset", resetPasswordViaOtp);

export default router;
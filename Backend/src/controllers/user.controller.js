import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.models.js";
import jwt from "jsonwebtoken";
import { generateOtp, verifyOtp, sendSmsOtp } from "../utils/otp.js";
import { v4 as uuidv4 } from "uuid";

const generateAccessAndRefereshTokens = async (userId, sessionId) => {
  try {
    const user = await User.findById(userId);

    const accessToken = jwt.sign(
      { _id: user._id, sessionId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    const refreshToken = jwt.sign(
      { _id: user._id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );

    user.refreshToken = refreshToken;
    user.sessions.push({ sessionId, userAgent: "mobile", ip: "client" });
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    throw new ApiError(500, "Token creation failed");
  }
};

export const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

  if (![fullName, email, phoneNumber, password, confirmPassword].every(Boolean))
    throw new ApiError(400, "All fields are required");

  if (password !== confirmPassword)
    throw new ApiError(400, "Passwords do not match");

  const exists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (exists) throw new ApiError(409, "User already exists");

  const user = await User.create({ fullName, email, phoneNumber, password });

  const sessionId = uuidv4();
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
    sessionId
  );

  res
    .status(201)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000, // 15 minutes
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    })
    .json(
      new ApiResponse(201, {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      }, "User registered and logged in.")
    );
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new ApiError(404, "User not found");

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) throw new ApiError(400, "Invalid credentials");

  const sessionId = uuidv4();
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
    sessionId
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 15 * 60 * 1000,
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    })
    .json(
      new ApiResponse(200, {
        user: {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
      })
    );
});

export const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } });

  res
    .status(200)
    .clearCookie("accessToken", { secure: true, sameSite: "none" })
    .clearCookie("refreshToken", { secure: true, sameSite: "none" })
    .json(new ApiResponse(200, {}, "Logout success"));
});

export const refreshAccessToken = asyncHandler(async (req, res) => {
  const refresh = req.cookies.refreshToken;
  if (!refresh) throw new ApiError(401, "Unauthenticated");

  const decoded = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
  const user = await User.findById(decoded._id);
  if (!user || user.refreshToken !== refresh)
    throw new ApiError(401, "Invalid refresh token");

  const sessionId = user.sessions[user.sessions.length - 1]?.sessionId || "unknown";
  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    user._id,
    sessionId
  );

  res
    .status(200)
    .cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    })
    .json(new ApiResponse(200, {}, "Token refreshed"));
});

// ✅ Forgot Password - Send OTP
export const sendOtpToPhone = asyncHandler(async (req, res) => {
  const { phoneNumber } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user) throw new ApiError(404, "Phone not registered");

  const formatPhone = (phoneNumber) => {
    const digits = phoneNumber.replace(/\D/g, '');
    
    const withoutLeadingZero = digits.startsWith('0') ? digits.slice(1) : digits;
    
    if (!phoneNumber.startsWith('+')) {
      return `+91${withoutLeadingZero}`;
    }
    return phoneNumber;
  };

  const formattedPhone = formatPhone(phoneNumber);
  const { code, expireAt } = generateOtp();
  user.otp = { code, expireAt };

  await user.save();
  
  try {
    await sendSmsOtp(formattedPhone, code);
    res.json(new ApiResponse(200, {}, "OTP sent successfully"));
  } catch (error) {
    console.error("SMS sending failed:", error);
    res.json(new ApiResponse(200, {}, "OTP sent (check console for SMS status)"));
  }
});


export const resetPasswordViaOtp = asyncHandler(async (req, res) => {
  const { phoneNumber, otp, newPassword } = req.body;
  const user = await User.findOne({ phoneNumber });
  if (!user || !user.otp) throw new ApiError(400, "Invalid request");

  const isValid = verifyOtp(user.otp.code, otp, user.otp.expireAt);
  if (!isValid) throw new ApiError(400, "OTP expired or incorrect");

  user.password = newPassword;
  user.otp = undefined;
  await user.save();

  res.json(new ApiResponse(200, {}, "Password reset"));
});

export const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id);
  const isPasswordCorrect = await user.comparePassword(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});
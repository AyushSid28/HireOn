import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Profile } from "../models/profile.models.js";
import axios from "axios";
import fs from "fs";
import path from "path";


export const createOrUpdateProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const resumePath = req.file ? `/uploads/${req.file.filename}` : null;
  if (!resumePath) {
    throw new ApiError(400, "Resume is required");
  }

  // Parse resume using the Python API
  let parsedResumeData = {};
  try {
    const resumeFilePath = path.join(process.cwd(), "uploads", req.file.filename);
    const FormData = require('form-data');
    const formData = new FormData();
    formData.append('file', fs.createReadStream(resumeFilePath));
    
    const parseResponse = await axios.post('http://localhost:8000/parse-resume', formData, {
      headers: {
        ...formData.getHeaders(),
      },
      timeout: 30000, // 30 seconds timeout
    });
    
    parsedResumeData = parseResponse.data;
    console.log("Resume parsed successfully:", parsedResumeData);
  } catch (error) {
    console.error("Resume parsing failed:", error.message);
    // Continue without parsed data if parsing fails
  }

  let profileData = req.body;

  try {
    if (typeof req.body.education === "string") {
      profileData.education = JSON.parse(req.body.education);
    }
    if (typeof req.body.skills === "string") {
      profileData.skills = JSON.parse(req.body.skills);
    }
    if (typeof req.body.experience === "string") {
      profileData.experience = JSON.parse(req.body.experience);
    }
    if (typeof req.body.jobPreferences === "string") {
      profileData.jobPreferences = JSON.parse(req.body.jobPreferences);
    }
    if (typeof req.body.certificatesAndAchievements === "string") {
      profileData.certificatesAndAchievements = JSON.parse(
        req.body.certificatesAndAchievements
      );
    }
  } catch (error) {
    throw new ApiError(400, "Invalid JSON fields in profile data.");
  }

  // Merge parsed resume data with form data (parsed data takes precedence)
  profileData = {
    ...profileData,
    ...parsedResumeData,
    // Map parsed fields to our schema
    skills: parsedResumeData.skills || profileData.skills || [],
    education: parsedResumeData.education || profileData.education || [],
    experience: parsedResumeData.experience || profileData.experience || [],
    certificatesAndAchievements: parsedResumeData.certifications || profileData.certificatesAndAchievements || [],
  };

  profileData.user = userId;
  profileData.resume = resumePath;

  const existing = await Profile.findOne({ user: userId });

  if (existing) {
    const updated = await Profile.findOneAndUpdate(
      { user: userId },
      profileData,
      { new: true, runValidators: true }
    );

    return res
      .status(200)
      .json(new ApiResponse(200, updated, "Profile updated successfully"));
  } else {
    const created = await Profile.create(profileData);

    return res
      .status(201)
      .json(new ApiResponse(201, created, "Profile created successfully"));
  }
});


export const getMyProfile = asyncHandler(async (req, res) => {
  const profile = await Profile.findOne({ user: req.user._id }).populate(
    "user",
    "fullName email phoneNumber"
  );

  if (!profile) {
    throw new ApiError(404, "Profile not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, profile, "Profile fetched successfully"));
});
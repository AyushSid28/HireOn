import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    country: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    zipCode: { type: String, required: true },
    address: { type: String, required: true },

    education: {
      school: { type: String, required: true },
      degree: { type: String, required: true },
      degreeStatus: {
        type: String,
        enum: ["Pending", "Incomplete", "Ongoing", "Completed"],
        default: "Completed",
        required: true,
      },
      major: { type: String, required: true },
      graduationYear: { type: String, required: true },
      gpa: { type: String },
    },

    skills: {
      codingLanguages: {
        type: [String],
        required: true,
      },
      general: {
        type: [String],
        required: true,
      },
      technical: {
        type: [String],
        required: true,
      },
      databasesAndTools: {
        type: [String],
        required: true,
      },
      devTools: {
        type: [String],
        required: true,
      },
    },

    certificatesAndAchievements: {
      type: [String],
      required: false,
    },

    experience: {
      hasExperience: {
        type: Boolean,
        required: true,
      },

      workExperience: {
        companyName: { type: String },
        jobRole: { type: String },
        description: { type: String },
      },

      internships: [
        {
          companyName: { type: String },
          role: { type: String },
          duration: { type: String }, 
          description: { type: String },
        },
      ],

      projects: [
        {
          title: { type: String },
          description: { type: String },
          technologies: [String],
          githubLink: { type: String },
        },
      ],
    },

    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String },
    resume: {
      type: String, 
      required: true,
    },

    jobPreferences: {
      jobType: { type: String, required: true },
      category: { type: String, required: true },
      location: { type: String, required: true },
      remote: { type: Boolean, required: true },
      startDate: { type: String, required: true },
      salary: { type: String }, // optional
    },

    coverLetter: { type: String },
  },
  { timestamps: true }
);


export const Profile = mongoose.model("Profile", profileSchema);
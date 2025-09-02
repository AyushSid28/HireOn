// src/components/Form.jsx
import React, { useState } from "react";
import axios from "axios";

export default function Form() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    country: "",
    city: "",
    state: "",
    zipCode: "",
    address: "",

    education: {
      school: "",
      degree: "",
      degreeStatus: "Completed",
      major: "",
      graduationYear: "",
      gpa: "",
    },

    skills: {
      codingLanguages: [],
      general: [],
      technical: [],
      databasesAndTools: [],
      devTools: [],
    },

    certificatesAndAchievements: [],

    experience: {
      hasExperience: false,
      workExperience: {
        companyName: "",
        jobRole: "",
        description: "",
      },
      internships: [
        {
          companyName: "",
          role: "",
          duration: "",
          description: "",
        },
      ],
      projects: [
        {
          title: "",
          description: "",
          technologies: [],
          githubLink: "",
        },
      ],
    },

    linkedin: "",
    github: "",
    portfolio: "",

    jobPreferences: {
      jobType: "",
      category: "",
      location: "",
      remote: false,
      startDate: "",
      salary: "",
    },

    coverLetter: "",
  });

  const [resume, setResume] = useState(null);
  const [isParsing, setIsParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);

  const VITE_API = import.meta.env.VITE_API_URL;

  const handleChange = (e, parent = null, index = null, subfield = null) => {
    const { name, value, type, checked } = e.target;
    const inputVal = type === "checkbox" ? checked : value;

    if (parent && index !== null) {
      const [parentKey, arrayKey] = parent.split(".");
      const updatedArray = [...form[parentKey][arrayKey]];

      updatedArray[index] = {
        ...updatedArray[index],
        [name || subfield]: inputVal,
      };

      setForm({
        ...form,
        [parentKey]: {
          ...form[parentKey],
          [arrayKey]: updatedArray,
        },
      });
      return;
    }

    if (parent) {
      const keys = parent.split(".");
      if (keys.length === 2) {
        const [parentKey, nestedKey] = keys;
        setForm({
          ...form,
          [parentKey]: {
            ...form[parentKey],
            [nestedKey]: {
              ...form[parentKey][nestedKey],
              [name]: inputVal,
            },
          },
        });
      } else {
        setForm({
          ...form,
          [parent]: {
            ...form[parent],
            [name]: inputVal,
          },
        });
      }
      return;
    }

    setForm({ ...form, [name]: inputVal });
  };

  const handleListChange = (e, category) => {
    const value = e.target.value.split(",").map((skill) => skill.trim());
    setForm({
      ...form,
      skills: {
        ...form.skills,
        [category]: value,
      },
    });
  };

  const handleCertificateChange = (e) => {
    setForm({
      ...form,
      certificatesAndAchievements: e.target.value
        .split(",")
        .map((v) => v.trim()),
    });
  };

  const parseResume = async (file) => {
    setIsParsing(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("http://localhost:8000/parse-resume", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to parse resume");
      }

      const data = await response.json();
      setParsedData(data);

      // Auto-fill form with parsed data
      if (data.name) {
        const nameParts = data.name.split(" ");
        setForm((prev) => ({
          ...prev,
          firstName: nameParts[0] || "",
          lastName: nameParts.slice(1).join(" ") || "",
        }));
      }

      if (data.skills && data.skills.length > 0) {
        setForm((prev) => ({
          ...prev,
          skills: {
            ...prev.skills,
            general: data.skills,
          },
        }));
      }

      if (data.education && data.education.length > 0) {
        const edu = data.education[0];
        setForm((prev) => ({
          ...prev,
          education: {
            ...prev.education,
            school: edu.institution || "",
            degree: edu.degree || "",
            major: edu.field_of_study || "",
            graduationYear: edu.year || "",
          },
        }));
      }

      if (data.experience && data.experience.length > 0) {
        const exp = data.experience[0];
        setForm((prev) => ({
          ...prev,
          experience: {
            ...prev.experience,
            hasExperience: true,
            workExperience: {
              companyName: exp.company || "",
              jobRole: exp.job_title || "",
              description: exp.description || "",
            },
          },
        }));
      }

      if (data.certifications && data.certifications.length > 0) {
        setForm((prev) => ({
          ...prev,
          certificatesAndAchievements: data.certifications,
        }));
      }

      alert(
        "Resume parsed successfully! Form has been auto-filled with extracted data."
      );
    } catch (error) {
      console.error("Resume parsing error:", error);
      alert("Failed to parse resume. Please fill the form manually.");
    } finally {
      setIsParsing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resume) {
      alert("Resume is required");
      return;
    }

    const formData = new FormData();
    formData.append("resume", resume);

    for (let key in form) {
      const value = form[key];
      formData.append(
        key,
        typeof value === "object" ? JSON.stringify(value) : value
      );
    }

    try {
      await axios.post(`${VITE_API}/api/profile`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Profile saved successfully!");
    } catch (err) {
      console.error("Form Error:", err);
      alert("Failed to save profile!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <h3 className="text-xl font-bold mb-2">General Information</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          "firstName",
          "lastName",
          "country",
          "city",
          "state",
          "zipCode",
          "address",
        ].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={key}
            className="input"
          />
        ))}
      </div>

      <h3 className="text-xl font-bold mb-2">Higher Education</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["school", "degree", "major", "graduationYear", "gpa"].map((key) => (
          <input
            key={key}
            name={key}
            value={form.education[key]}
            onChange={(e) => handleChange(e, "education")}
            placeholder={key}
            className="input"
          />
        ))}
        <select
          name="degreeStatus"
          value={form.education.degreeStatus}
          onChange={(e) => handleChange(e, "education")}
          className="input"
        >
          <option value="Completed">Completed</option>
          <option value="Ongoing">Ongoing</option>
          <option value="Pending">Pending</option>
          <option value="Incomplete">Incomplete</option>
        </select>
      </div>

      <h3 className="text-xl font-bold mb-2">Skills & Technologies</h3>
      {Object.keys(form.skills).map((category) => (
        <input
          key={category}
          placeholder={`${category} (comma-separated)`}
          onChange={(e) => handleListChange(e, category)}
          className="input"
        />
      ))}
      <textarea
        placeholder="Certifications & Achievements (comma separated)"
        onChange={handleCertificateChange}
        className="input mt-3"
      />

      <div>
        <label className="block font-medium text-gray-700 mb-2">
          Upload Resume (PDF)
        </label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => {
            const file = e.target.files[0];
            setResume(file);
            if (file) {
              parseResume(file);
            }
          }}
          required
        />
        {isParsing && (
          <p className="text-blue-600 text-sm mt-2">
            🔄 Parsing resume... Please wait.
          </p>
        )}
        {parsedData && (
          <p className="text-green-600 text-sm mt-2">
            ✅ Resume parsed successfully! Form has been auto-filled.
          </p>
        )}
      </div>

      <h3 className="text-xl font-bold mb-2 mt-8">Experience</h3>
      <label>
        <input
          type="checkbox"
          checked={form.experience.hasExperience}
          name="hasExperience"
          onChange={(e) => handleChange(e, "experience")}
          className="mr-2"
        />
        I have professional experience
      </label>

      {form.experience.hasExperience ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
          {["companyName", "jobRole", "description"].map((field) => (
            <input
              key={field}
              name={field}
              value={form.experience.workExperience[field]}
              onChange={(e) => handleChange(e, "experience.workExperience")}
              placeholder={field}
              className="input"
            />
          ))}
        </div>
      ) : (
        <>
          <h4 className="text-md font-semibold mt-4">Internship</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["companyName", "role", "duration", "description"].map((field) => (
              <input
                key={field}
                name={field}
                value={form.experience.internships[0][field]}
                onChange={(e) => handleChange(e, "experience.internships", 0)}
                placeholder={field}
                className="input"
              />
            ))}
          </div>
          <h4 className="text-md font-semibold mt-4">Project</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {["title", "description", "githubLink"].map((field) => (
              <input
                key={field}
                name={field}
                value={form.experience.projects[0][field]}
                onChange={(e) => handleChange(e, "experience.projects", 0)}
                placeholder={field}
                className="input"
              />
            ))}
            <input
              name="technologies"
              placeholder="Technologies (comma separated)"
              value={form.experience.projects[0].technologies.join(", ")}
              onChange={(e) => {
                const value = e.target.value.split(",").map((v) => v.trim());
                const updated = [...form.experience.projects];
                updated[0].technologies = value;
                setForm({
                  ...form,
                  experience: {
                    ...form.experience,
                    projects: updated,
                  },
                });
              }}
              className="input"
            />
          </div>
        </>
      )}

      <h3 className="text-xl font-bold mb-2 mt-6">Profiles & Links</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["linkedin", "github", "portfolio"].map((key) => (
          <input
            key={key}
            name={key}
            value={form[key]}
            onChange={handleChange}
            placeholder={`${key} URL`}
            className="input"
          />
        ))}
      </div>

      <h3 className="text-xl font-bold mb-2">Job Preferences</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["jobType", "category", "location", "salary"].map((key) => (
          <input
            key={key}
            name={key}
            value={form.jobPreferences[key]}
            onChange={(e) => handleChange(e, "jobPreferences")}
            placeholder={key}
            className="input"
          />
        ))}
        <input
          type="date"
          name="startDate"
          value={form.jobPreferences.startDate}
          onChange={(e) => handleChange(e, "jobPreferences")}
          className="input"
        />
        <label className="flex items-center">
          <input
            type="checkbox"
            name="remote"
            checked={form.jobPreferences.remote}
            onChange={(e) => handleChange(e, "jobPreferences")}
            className="mr-2"
          />
          Remote Work Preferred
        </label>
      </div>

      <h3 className="text-xl font-bold mb-2">Cover Letter</h3>
      <textarea
        name="coverLetter"
        value={form.coverLetter}
        onChange={handleChange}
        className="input"
        placeholder="Write your cover letter here..."
      />

      <button
        type="submit"
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700 transition w-[200px]"
      >
        Save Profile
      </button>
    </form>
  );
}

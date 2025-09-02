// src/pages/PersonalForm/PersonalForm.jsx
import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Form from "../../components/Form";

export default function PersonalForm() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#f0f4ff] to-[#e8efff] px-4">
      <div className="bg-white rounded-xl shadow-lg p-10 w-full max-w-5xl">
        <h1
          className="text-3xl font-bold text-blue-600 text-center mb-4"
          style={{ fontFamily: "cursive" }}
        >
          HireON
        </h1>
        <h2 className="text-2xl font-bold text-center">
          Complete Your Profile
        </h2>
        <p className="text-gray-500 text-center mb-8">
          Fill in your details to enable AI-powered job applications.
        </p>

        <Form />
      </div>
    </div>
  );
}

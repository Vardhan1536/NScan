import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { uploadHealthReportAPI } from "../components/auth/api";

interface ApiError {
  message: string;
}

export const UploadReport: React.FC = () => {
  const [formData, setFormData] = useState<FormData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null); // Reset error message
    if (e.target.files) {
      const file = e.target.files[0];

      // Check if file size exceeds 5MB
      if (file.size > 5 * 1024 * 1024) {
        setError("File size should not exceed 5MB.");
        return;
      }

      // Check if the file is either PDF or an image
      if (!file.type.includes("pdf") && !file.type.includes("image")) {
        setError("Only PDF or image files are allowed.");
        return;
      }

      const data = new FormData();
      data.append("file", file);
      data.append("title", file.name);
      data.append("date", new Date().toLocaleDateString());
      data.append("type", "Uploaded Report");
      console.log("FormData:", Array.from(data.entries()));
      setFormData(data); // Store the form data
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData) {
      setError("Please upload a file before submitting.");
      return;
    }

    setLoading(true);
    setError(null); // Reset error message

    try {
      // Call the API to upload the file
      await uploadHealthReportAPI(formData);

      // Create a new report object to be passed to the next page
      const newReport = {
        id: Date.now().toString(),
        title: formData.get("title") as string,
        date: formData.get("date") as string,
        type: formData.get("type") as string,
        fileUrl: "#", // You can modify this once you have the file URL from the API response
      };

      console.log("Navigating to MedicalHistory with report:", newReport);
      
      // Redirect to the Medical History page and pass the new report data as state
      navigate("/medical-history", { state: { newReport } });
    } catch (error: ApiError | unknown) {
      if ("message" in (error as ApiError)) {
        console.error("Upload failed:", error);
        setError((error as ApiError).message);
      } else {
        console.error("Unexpected error:", error);
        setError("An unexpected error occurred.");
      }
    } finally {
      setLoading(false); // Stop the loading indicator
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="space-y-4 w-96 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-lg font-bold mb-4">Upload Health Report</h1>

        {/* File input */}
        <input
          type="file"
          onChange={handleFileChange}
          className="border border-gray-300 p-2 rounded w-full"
          accept=".pdf,image/*"
        />

        {/* Error message */}
        {error && <p className="text-red-500 text-sm">{error}</p>}

        {/* Submit button */}
        <button
          type="submit"
          className={`p-2 w-full rounded ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
          } text-white`}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

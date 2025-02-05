import React, { useState, useEffect } from "react";
import { Card } from "../components/Card";
import { FileUp, ClipboardList, Edit2, Trash, Download } from "lucide-react";
import { MedicalSurvey } from "../components/medical/MedicalSurvey";
import { UserProfile } from "../components/medical/UserProfile";
import { Button } from "../components/Button";
import { useLocation } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

export const MedicalHistory: React.FC = () => {
  const location = useLocation();
  const newReport = location.state?.newReport;
  const [mode, setMode] = useState<"choose" | "survey" | "upload">("choose");
  const [reports, setReports] = useState<any[]>([]);

  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load reports from localStorage when the component mounts
    const storedReports = localStorage.getItem("reports");
    if (storedReports) {
      setReports(JSON.parse(storedReports));
    }
  }, []);

  useEffect(() => {
    // Update localStorage whenever the reports state changes
    if (reports.length > 0) {
      localStorage.setItem("reports", JSON.stringify(reports));
    }
  }, [reports]);

  if (newReport && !reports.find((report) => report.id === newReport.id)) {
    setReports((prevReports) => [...prevReports, newReport]);
  }

  const handleDelete = (id: string) => {
    const updatedReports = reports.filter((report) => report.id !== id);
    setReports(updatedReports);
  };

  const handleEdit = (id: string, title: string) => {
    setEditingReportId(id);
    setNewTitle(title);
  };

  const handleSaveEdit = (id: string) => {
    const updatedReports = reports.map((report) =>
      report.id === id ? { ...report, title: newTitle } : report
    );
    setReports(updatedReports);
    setEditingReportId(null);
    setNewTitle("");
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setUploadedFile(event.target.files[0]);
      setError(""); // Reset any previous error
    }
  };

  const navigate = useNavigate();
  const handleUpload = async () => {
    if (!uploadedFile) {
      setError("Please select a file to upload.");
      return;
    }
  
    setLoading(true);
    // Simulating upload process
    setTimeout(() => {
      const newReport = {
        id: `${reports.length + 1}`,
        title: uploadedFile.name,
        date: new Date().toLocaleDateString(),
        type: "Uploaded Report",
        file: uploadedFile, // Save the actual file object, not the Blob URL
      };
  
      setReports((prevReports) => [...prevReports, newReport]);
  
      // Save the reports with file object in localStorage
      localStorage.setItem("reports", JSON.stringify([...reports, newReport]));
  
      setUploadedFile(null);
      setLoading(false);
      setMode("choose"); // Go back to the "choose" mode after upload
      navigate('/scan', { state: { medicalFile: uploadedFile } });
    }, 2000);
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    document.body.appendChild(link); // Append link to body for better compatibility
    link.click();

    // Clean up the object URL after download
    link.remove();
  };

  if (mode === "survey") {
    return <MedicalSurvey onBack={() => setMode("choose")} />;
  }

  if (mode === "upload") {
    return (
      <div className="p-6 border-2 border-dashed rounded-lg hover:border-[#646cff] transition-colors">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleUpload();
          }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <h1 className="text-lg font-semibold mb-4 text-center">
            Upload Health Report
          </h1>

          {/* File input */}
          <input
            type="file"
            onChange={handleFileChange}
            className="border border-gray-300 p-2 rounded w-full mb-4"
            accept=".pdf,image/*"
          />

          {/* Error message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit button */}
          <button
            type="submit"
            className={`p-6 border-2 border-dashed rounded-lg hover:border-[#646cff] transition-colors ${
              loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
            } text-white w-full`}
            disabled={loading}
          >
            <FileUp className="h-12 w-12 mx-auto mb-4 text-[#646cff]" />
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfile
        user={{
          name: "John Doe",
          age: 32,
          bloodGroup: "O+",
          height: "175 cm",
          weight: "70 kg",
          lastCheckup: "March 15, 2024",
        }}
      />

      <Card>
        <h3 className="text-xl font-semibold mb-6">Previous Reports</h3>
        <div className="space-y-4">
          {reports.map((report) => (
            <div
              key={report.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center space-x-4">
                <FileUp className="h-5 w-5 text-[#646cff]" />
                <div>
                  {editingReportId === report.id ? (
                    <input
                      type="text"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="border rounded p-1 text-sm"
                    />
                  ) : (
                    <h4 className="font-medium">{report.title}</h4>
                  )}
                  <p className="text-sm text-gray-600">
                    {report.date} • {report.type}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                {editingReportId === report.id ? (
                  <Button
                    variant="secondary"
                    onClick={() => handleSaveEdit(report.id)}
                  >
                    Save
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    onClick={() => handleEdit(report.id, report.title)}
                  >
                    <Edit2 className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                )}
                <Button
                  variant="secondary"
                  onClick={() => handleDelete(report.id)}
                  className="text-red-500 hover:text-red-600"
                >
                  <Trash className="h-4 w-4 mr-1" />
                  Delete
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleDownload(report.fileUrl, report.title)}
                  className="text-green-500 hover:text-green-600"
                >
                  <Download className="h-4 w-4 mr-1" />
                  Download
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="text-2xl font-bold mb-6">Update Medical History</h2>
        <p className="text-gray-600 mb-8">
          Choose how you'd like to provide your medical information for better
          personalized recommendations.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => setMode("upload")}
            className="p-6 border-2 border-dashed rounded-lg hover:border-[#646cff] transition-colors"
          >
            <FileUp className="h-12 w-12 mx-auto mb-4 text-[#646cff]" />
            <h3 className="text-lg font-semibold mb-2">
              Upload Medical Reports
            </h3>
            <p className="text-gray-600 text-sm">
              Upload your existing medical reports for accurate analysis
            </p>
          </button>
          <button
            onClick={() => setMode("survey")}
            className="p-6 border-2 border-dashed rounded-lg hover:border-[#646cff] transition-colors"
          >
            <ClipboardList className="h-12 w-12 mx-auto mb-4 text-[#646cff]" />
            <h3 className="text-lg font-semibold mb-2">Fill out Survey</h3>
            <p className="text-gray-600 text-sm">
              Fill out a survey for health data collection
            </p>
          </button>
        </div>
      </Card>
    </div>
  );
};

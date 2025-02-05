import React, { useState } from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { ArrowLeft, Upload, File } from 'lucide-react';

interface ReportUploadProps {
  onBack: () => void;
}

export const ReportUpload: React.FC<ReportUploadProps> = ({ onBack }) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  return (
    <Card>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-4">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Upload Medical Reports</h2>
      </div>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          setFiles(Array.from(e.dataTransfer.files));
        }}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-600 mb-2">Drag and drop your medical reports here</p>
        <p className="text-sm text-gray-500">Supported formats: PDF, JPG, PNG</p>
        <input
          type="file"
          multiple
          accept=".pdf,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="hidden"
          id="report-upload"
        />
        <Button
          variant="secondary"
          className="mt-4"
          onClick={() => document.getElementById('report-upload')?.click()}
        >
          Browse Files
        </Button>
      </div>
      {files.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium mb-2">Selected Files:</h3>
          {files.map((file, index) => (
            <div key={index} className="flex items-center p-2 bg-gray-50 rounded-lg">
              <File className="h-4 w-4 mr-2" />
              <span className="text-sm">{file.name}</span>
            </div>
          ))}
          <Button className="w-full mt-4">Upload Reports</Button>
        </div>
      )}
    </Card>
  );
};
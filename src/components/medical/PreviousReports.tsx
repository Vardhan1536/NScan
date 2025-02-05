import React from 'react';
import { Card } from '../Card';
import { FileText, Download, Eye } from 'lucide-react';
import { Button } from '../Button';

interface Report {
  id: string;
  title: string;
  date: string;
  type: string;
  fileUrl: string;
}

interface PreviousReportsProps {
  reports: Report[];
}

export const PreviousReports: React.FC<PreviousReportsProps> = ({ reports }) => {
  return (
    <Card>
      <h3 className="text-xl font-semibold mb-6">Previous Reports</h3>
      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center space-x-4">
              <FileText className="h-5 w-5 text-[#646cff]" />
              <div>
                <h4 className="font-medium">{report.title}</h4>
                <p className="text-sm text-gray-600">
                  {report.date} • {report.type}
                </p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="secondary">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
              <Button variant="secondary">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
              <Button variant="secondary">
                <Download className="h-4 w-4 mr-1" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
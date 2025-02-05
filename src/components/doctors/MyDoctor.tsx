import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { MessageSquare, Calendar, Clock } from 'lucide-react';

export const MyDoctor: React.FC = () => {
  return (
    <Card>
      <div className="flex items-start space-x-6">
        <img
          src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80"
          alt="Dr. Sarah Johnson"
          className="w-24 h-24 rounded-lg object-cover"
        />
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-2">Dr. Sarah Johnson</h2>
          <p className="text-gray-600 mb-4">Clinical Nutritionist</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Available Now</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>Next Appointment: Tomorrow, 2:00 PM</span>
            </div>
          </div>
          <div className="flex space-x-4">
            <Button>
              <MessageSquare className="h-4 w-4 mr-2" />
              Message
            </Button>
            <Button variant="secondary">
              <Calendar className="h-4 w-4 mr-2" />
              Schedule Appointment
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
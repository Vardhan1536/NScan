import React from 'react';
import { Card } from '../Card';
import { Button } from '../Button';
import { MessageSquare, MapPin, Star, Eye } from 'lucide-react';
import type { Doctor } from '../../types';

export const DoctorList: React.FC = () => {
  const doctors: Doctor[] = [
    {
      id: '1',
      name: 'Dr. Michael Chen',
      specialty: 'Dietitian',
      imageUrl: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80',
      availability: true
    },
    {
      id: '2',
      name: 'Dr. Emily Rodriguez',
      specialty: 'Clinical Nutritionist',
      imageUrl: 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80',
      availability: true
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {doctors.map((doctor) => (
        <Card key={doctor.id}>
          <div className="flex items-start space-x-4">
            <img
              src={doctor.imageUrl}
              alt={doctor.name}
              className="w-20 h-20 rounded-lg object-cover"
            />
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold">{doctor.name}</h3>
                  <p className="text-gray-600 text-sm">{doctor.specialty}</p>
                </div>
                <div className="flex items-center text-yellow-400">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="ml-1 text-sm">4.8</span>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600 mt-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>2.5 miles away</span>
              </div>
              <div className="mt-4 flex space-x-3">
                <Button className="px-3 py-1 text-sm">
                  <MessageSquare className="h-3 w-3 mr-1" />
                  Chat
                </Button>
                <Button variant="secondary" className="px-4 py-2 text-md">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button variant="secondary">
                  View Profile
                </Button>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
import React from 'react';
import { Card } from '../Card';
import { User } from 'lucide-react';

interface UserDetailsProps {
  user: {
    name: string;
    age: number;
    bloodGroup: string;
    height: string;
    weight: string;
    lastCheckup: string;
  };
}

export const UserProfile: React.FC<UserDetailsProps> = ({ user }) => {
  return (
    <Card>
      <div className="flex items-center space-x-4 mb-6">
        <div className="bg-[#646cff] p-3 rounded-full">
          <User className="h-6 w-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-semibold">{user.name}</h3>
          <p className="text-gray-600">Last checkup: {user.lastCheckup}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Age</p>
          <p className="font-semibold">{user.age} years</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Blood Group</p>
          <p className="font-semibold">{user.bloodGroup}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Height</p>
          <p className="font-semibold">{user.height}</p>
        </div>
        <div className="p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Weight</p>
          <p className="font-semibold">{user.weight}</p>
        </div>
      </div>
    </Card>
  );
};
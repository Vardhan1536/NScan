import React, { useState } from 'react';
// import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { DoctorList } from '../components/doctors/DoctorList';
import { MyDoctor } from '../components/doctors/MyDoctor';

export const Doctors: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'my-doctor' | 'find-doctors'>('my-doctor');

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <Button
          variant={activeTab === 'my-doctor' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('my-doctor')}
        >
          My Doctor
        </Button>
        <Button
          variant={activeTab === 'find-doctors' ? 'primary' : 'secondary'}
          onClick={() => setActiveTab('find-doctors')}
        >
          Find Doctors
        </Button>
      </div>

      {activeTab === 'my-doctor' ? <MyDoctor /> : <DoctorList />}
    </div>
  );
};
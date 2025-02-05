import React, { useState } from 'react';
import { Card } from '../Card';
import { Input } from '../Input';
import { Button } from '../Button';
import { ArrowLeft } from 'lucide-react';

interface MedicalSurveyProps {
  onBack: () => void;
}

export const MedicalSurvey: React.FC<MedicalSurveyProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: 'moderate',
    conditions: [] as string[],
    allergies: [] as string[]
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle survey submission
  };

  return (
    <Card>
      <div className="flex items-center mb-6">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full mr-4">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h2 className="text-2xl font-bold">Medical Survey</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Age"
            type="number"
            value={formData.age}
            onChange={(e) => setFormData(prev => ({ ...prev, age: e.target.value }))}
          />
          <Input
            label="Weight (kg)"
            type="number"
            value={formData.weight}
            onChange={(e) => setFormData(prev => ({ ...prev, weight: e.target.value }))}
          />
          <Input
            label="Height (cm)"
            type="number"
            value={formData.height}
            onChange={(e) => setFormData(prev => ({ ...prev, height: e.target.value }))}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              value={formData.activityLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, activityLevel: e.target.value }))}
            >
              <option value="sedentary">Sedentary</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
            </select>
          </div>
        </div>
        <Button type="submit">Submit Survey</Button>
      </form>
    </Card>
  );
};
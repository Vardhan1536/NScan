import React from 'react';
import { Card } from '../Card';

export const AnalysisResult: React.FC = () => {
  return (
    <Card>
      <h3 className="text-xl font-semibold mb-4">Analysis Results</h3>
      <div className="space-y-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium">Identified Food:</p>
          <p className="text-gray-600">Processing...</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Calories</p>
            <p className="font-semibold">245 kcal</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Protein</p>
            <p className="font-semibold">12g</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Carbs</p>
            <p className="font-semibold">30g</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">Fat</p>
            <p className="font-semibold">8g</p>
          </div>
        </div>
      </div>
    </Card>
  );
};
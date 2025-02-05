import React from 'react';
import { X } from 'lucide-react';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SuggestionModal: React.FC<SuggestionModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl">
        <div className="p-4 border-b flex justify-between items-center">
          <h3 className="text-xl font-semibold">AI Suggestions</h3>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Nutritional Analysis</h4>
            <p className="text-gray-600">Based on your medical history and the scanned food item...</p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Recommendations</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Consider portion control due to high caloric content</li>
              <li>Good source of protein for your fitness goals</li>
              <li>Contains allergens you should avoid</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">Alternatives</h4>
            <ul className="list-disc pl-5 space-y-2 text-gray-600">
              <li>Greek yogurt with berries (lower calories, higher protein)</li>
              <li>Quinoa bowl with vegetables (better nutrient profile)</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
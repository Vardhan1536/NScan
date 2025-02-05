import React from 'react';
import { Card } from '../Card';
import { Salad, Dumbbell, Moon } from 'lucide-react';

const tips = [
  {
    icon: Salad,
    title: "Nutrition Tip",
    text: "Include colorful vegetables in every meal for a variety of nutrients."
  },
  {
    icon: Dumbbell,
    title: "Exercise Tip",
    text: "Start with 10 minutes of daily exercise and gradually increase duration."
  },
  {
    icon: Moon,
    title: "Wellness Tip",
    text: "Aim for 7-8 hours of quality sleep for better health and recovery."
  }
];

export const HealthTips: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {tips.map((tip, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <tip.icon className="h-8 w-8 text-[#646cff] mb-4" />
          <h3 className="text-lg font-semibold mb-2">{tip.title}</h3>
          <p className="text-gray-600">{tip.text}</p>
        </Card>
      ))}
    </div>
  );
};
import React from 'react';
import { Card } from '../Card';

const exercises = [
  {
    name: "Morning Yoga",
    duration: "20 mins",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&q=80"
  },
  {
    name: "HIIT Workout",
    duration: "15 mins",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80"
  },
  {
    name: "Meditation",
    duration: "10 mins",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80"
  }
];

export const RecommendedExercises: React.FC = () => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Recommended Activities</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {exercises.map((exercise, index) => (
          <Card key={index} className="overflow-hidden">
            <img
              src={exercise.image}
              alt={exercise.name}
              className="w-full h-48 object-cover rounded-lg mb-4"
            />
            <h3 className="font-semibold mb-1">{exercise.name}</h3>
            <p className="text-sm text-gray-600">{exercise.duration}</p>
          </Card>
        ))}
      </div>
    </div>
  );
};
import React from 'react';
import { Quote } from 'lucide-react';

const quotes = [
  {
    text: "Let food be thy medicine, and medicine be thy food.",
    author: "Hippocrates"
  },
  {
    text: "The greatest wealth is health.",
    author: "Virgil"
  },
  {
    text: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn"
  }
];

export const HealthQuote: React.FC = () => {
  const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

  return (
    <div className="bg-[#646cff] text-white p-6 rounded-lg relative overflow-hidden">
      <Quote className="absolute right-4 top-4 h-24 w-24 opacity-10" />
      <p className="text-xl font-medium mb-4">{randomQuote.text}</p>
      <p className="text-sm opacity-80">- {randomQuote.author}</p>
    </div>
  );
};
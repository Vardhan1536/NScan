import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { HealthQuote } from '../components/home/HealthQuote';
import { HealthTips } from '../components/home/HealthTips';
import { RecommendedExercises } from '../components/home/RecommendedExercises';
import { useAuth } from '../components/auth/AuthContext';

export const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <div 
        className="relative h-[600px] -mx-4 sm:-mx-6 lg:-mx-8 flex items-center"
        style={{
          backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://images.unsplash.com/photo-1490818387583-1baba5e638af?auto=format&fit=crop&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-5xl font-bold mb-6">Your Personal Food Nutrition Assistant</h1>
          <p className="text-xl mb-8">Scan, Analyze, and Understand your food like never before.</p>
          <Button className="inline-flex items-center">
            Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>

      {isAuthenticated && (
        <>
          {/* Daily Quote */}
          <HealthQuote />

          {/* Health Tips */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Daily Health Tips</h2>
            <HealthTips />
          </div>

          {/* Recommended Exercises */}
          <RecommendedExercises />
        </>
      )}

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8">
        {[
          {
            title: 'Food Identification',
            description: 'Instantly identify any food item with our advanced scanning technology'
          },
          {
            title: 'Nutritional Analysis',
            description: 'Get detailed nutritional information and health insights'
          },
          {
            title: 'Smart Recommendations',
            description: 'Receive personalized food suggestions based on your health profile'
          }
        ].map((feature, index) => (
          <div key={index} className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
            <p className="text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* CTA Section */}
      <div className="bg-[#e6e6ff] rounded-2xl p-12 text-center">
        <h2 className="text-3xl font-bold mb-6">Ready to Transform Your Nutrition Journey?</h2>
        <p className="text-lg mb-8">Join thousands of users who have already improved their eating habits.</p>
        <Button variant="primary">Start Free Trial</Button>
      </div>
    </div>
  );
};

export default Home;
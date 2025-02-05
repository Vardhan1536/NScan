import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../components/auth/AuthContext';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    if (!username || !password) {
      setErrorMessage('Both username and password are required.');
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMessage(data.detail || 'Something went wrong. Please try again.');
        return;
      }

      // Use the signup function from the context to store token and username
      signup(data.username, data.token);

      // Redirect to home page or dashboard after successful signup
      navigate('/');

      setUsername('');
      setPassword('');
    } catch (error) {
      console.error("An error occurred:", error);
      setErrorMessage('Failed to connect to the server. Please check your network.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">Sign Up for NutriScan</h2>
        <form onSubmit={handleSignUp} className="space-y-6">
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Signing Up...' : 'Sign Up'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../components/Input';
import { Button } from '../components/Button';
import { Card } from '../components/Card';
import { useAuth } from '../components/auth/AuthContext'; // Import AuthContext
// import { InputAdornment, IconButton, VisibilityOff,Visibility } from '@mui/material';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth(); // Access login and signup from context
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);
  const [accountCreated, setAccountCreated] = useState(false);


 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isNewUser) {
        // Sign up the user using the Auth context signup method
        await signup(username, password);
        setSuccessMessage('Account created successfully!');
        setUsername('');
        setPassword('');
        setAccountCreated(true);
        setErrorMessage('');
      } else {
        // Log in the user using the Auth context login method
        await login(username, password);
        setSuccessMessage('Login successful!');
        setErrorMessage('');
        navigate('/'); // Redirect to homepage or dashboard
      }
    } catch (error: unknown) {
      console.error("An error occurred:", error);
      setErrorMessage('Something went wrong. Please try again.');
      setSuccessMessage('');
    }
  };

  const handleToggleMode = () => {
    setIsNewUser(!isNewUser);
    setUsername('');
    setPassword('');
    setErrorMessage('');
    setSuccessMessage('');
    setAccountCreated(false);
  };

  const handleBackToLogin = () => {
    setIsNewUser(false);
    setSuccessMessage('');
    setAccountCreated(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f9f9] px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-8">
          {isNewUser ? 'Sign Up' : 'Login'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
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
          {errorMessage && <div className="text-red-500 text-sm">{errorMessage}</div>}
          {successMessage && <div className="text-green-500 text-sm">{successMessage}</div>}
          <Button type="submit" className="w-full">
            {isNewUser ? 'Sign Up' : 'Sign In'}
          </Button>
        </form>
        <div className="text-center mt-4">
          {!accountCreated && (
            <span
              className="text-blue-500 cursor-pointer"
              onClick={handleToggleMode}
            >
              {isNewUser ? 'Already have an account? Log In' : 'New user? Sign Up'}
            </span>
          )}
        </div>
        {isNewUser && accountCreated && (
          <div className="text-center mt-4">
            <span
              className="text-blue-500 cursor-pointer"
              onClick={handleBackToLogin}
            >
              Back to Login
            </span>
          </div>
        )}
      </Card>
    </div>
  );
};
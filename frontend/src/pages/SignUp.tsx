import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';

export default function SignUp() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = api;
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await signup(username, password);
      
      if (!response.success) {
        // Handle error from API response
        setError(response.error || 'Failed to sign up');
        return;
      }

      // Successful signup
      navigate('/signin');
    } catch (err: any) {
      // Handle network or other errors
      setError(err.response?.data?.error || 'Network error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-8">Join echo.Ink</h1>
      {error && (
        <div className="bg-red-50 text-red-500 p-3 rounded-md mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="input"
            placeholder="3-20 characters"
            minLength={3}
            maxLength={20}
            required
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input"
            placeholder="At least 8 characters"
            minLength={8}
            maxLength={20}
            required
            disabled={isLoading}
          />
        </div>
        <button 
          type="submit" 
          className={`w-full btn btn-primary ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{' '}
        <Link to="/signin" className="text-green-600 hover:text-green-700">
          Sign in
        </Link>
      </p>
    </div>
  );
} 
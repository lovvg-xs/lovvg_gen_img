import React, { useState } from 'react';
import Button from '../components/Button';

interface LoginScreenProps {
  onSuccess: () => void;
}

// Hardcoded credentials for simplicity
const CORRECT_USERNAME = 'admin';
const CORRECT_PASSWORD = 'Youtube@2025';

const LoginScreen: React.FC<LoginScreenProps> = ({ onSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === CORRECT_USERNAME && password === CORRECT_PASSWORD) {
      setError('');
      onSuccess();
    } else {
      setError('Invalid username or password. Please try again.');
      setPassword('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4 font-press-start">
      <div className="w-full max-w-sm">
        <form 
          onSubmit={handleSubmit}
          className="bg-gray-800 p-8 border-4 border-black shadow-[8px_8px_0_0_#000] flex flex-col gap-6"
          aria-label="Login Form"
        >
          <h1 className="text-2xl text-cyan-400 uppercase tracking-wider text-center">
            Login Required
          </h1>
          
          <div>
            <label htmlFor="username" className="block mb-2 text-lg text-gray-300">Username</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-3 bg-gray-900 border-2 border-gray-600 focus:border-cyan-400 focus:outline-none selection:bg-cyan-400 selection:text-black"
              placeholder="admin"
              required
              autoFocus
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password"className="block mb-2 text-lg text-gray-300">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-gray-900 border-2 border-gray-600 focus:border-cyan-400 focus:outline-none selection:bg-cyan-400 selection:text-black"
              placeholder="password"
              required
              aria-required="true"
            />
          </div>
          
          {error && (
            <p className="text-red-500 text-sm bg-red-900/50 border border-red-500 p-2" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" className="w-full text-lg py-3">
            Enter
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Hint: LOL
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Lock, AlertCircle, LogIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const LoginForm: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuthStore();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError('Please enter both username and password');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const success = await login(username, password);
      
      if (success) {
        navigate('/');
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <motion.div
      className="bg-white rounded-lg shadow-md p-8 w-full max-w-md"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="text-center mb-8">
        <h2 className="heading-2 mb-2">Welcome Back!</h2>
        <p className="text-gray-600">
          Log in to order delicious Tamil Nadu recipes or access your admin dashboard.
        </p>
      </div>
      
      <form onSubmit={handleSubmit}>
        {error && (
          <motion.div 
            className="bg-error/10 border border-error/30 text-error rounded-md p-3 mb-4 flex items-center"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
          >
            <AlertCircle size={18} className="mr-2 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </motion.div>
        )}
        
        <div className="mb-4">
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Username
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <User size={18} className="text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              className="input pl-10"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hint: Use "nammarecipe" as username
          </p>
        </div>
        
        <div className="mb-6">
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input
              id="password"
              type="password"
              className="input pl-10"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Hint: Use "user" for customer, "admin" for admin access
          </p>
        </div>
        
        <button 
          type="submit" 
          className="btn-primary w-full flex items-center justify-center"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loader" style={{ width: '20px', height: '20px' }}></span>
          ) : (
            <>
              <LogIn size={18} className="mr-2" />
              Log In
            </>
          )}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account? Sign-up coming soon!
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;
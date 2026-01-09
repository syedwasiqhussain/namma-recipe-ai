import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/auth/LoginForm';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  const navigate = useNavigate();
  
  // If already authenticated, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }
  
  return (
    <div className="section bg-gradient-to-r from-primary/5 to-secondary/5 min-h-[80vh] flex items-center">
      <div className="container-custom mx-auto">
        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-md"
          >
            <LoginForm />
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
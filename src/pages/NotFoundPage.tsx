import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Home, AlertCircle } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="section bg-gradient-to-r from-primary/5 to-secondary/5 min-h-[80vh] flex items-center">
      <div className="container-custom mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-center mb-6">
            <AlertCircle size={80} className="text-accent" />
          </div>
          
          <h1 className="text-6xl font-bold text-text mb-4">404</h1>
          <h2 className="heading-2 mb-6">Page Not Found</h2>
          
          <p className="text-lg text-gray-600 mb-8 max-w-md mx-auto">
            Oops! The recipe you're looking for seems to have been moved or doesn't exist.
          </p>
          
          <Link to="/" className="btn-primary flex items-center justify-center mx-auto w-48">
            <Home size={18} className="mr-2" />
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFoundPage;
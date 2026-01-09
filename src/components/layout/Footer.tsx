import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Instagram, Facebook, Twitter, Mail } from 'lucide-react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container-custom mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center mb-4">
              <motion.div
                whileHover={{ rotate: 10 }}
                className="mr-2 text-secondary"
              >
                <ChefHat size={24} />
              </motion.div>
              <span className="font-display text-xl font-bold text-white">
                Namma Recipe
              </span>
            </Link>
            <p className="text-gray-400 mb-4">
              Discover authentic Tamil Nadu recipes, from traditional classics to modern favorites, all in one place.
            </p>
            <div className="flex space-x-4">
              <motion.a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-secondary transition-colors duration-200"
              >
                <Instagram size={20} />
              </motion.a>
              <motion.a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-secondary transition-colors duration-200"
              >
                <Facebook size={20} />
              </motion.a>
              <motion.a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-secondary transition-colors duration-200"
              >
                <Twitter size={20} />
              </motion.a>
              <motion.a 
                href="mailto:info@nammarecipe.com" 
                whileHover={{ y: -3 }}
                className="text-gray-400 hover:text-secondary transition-colors duration-200"
              >
                <Mail size={20} />
              </motion.a>
            </div>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/generator" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Recipe Generator
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Popular Categories */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/generator?category=traditional" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Traditional Foods
                </Link>
              </li>
              <li>
                <Link to="/generator?category=fastfood" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Fast Foods
                </Link>
              </li>
              <li>
                <Link to="/generator?category=vegetarian" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Vegetarian
                </Link>
              </li>
              <li>
                <Link to="/generator?category=nonvegetarian" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Non-Vegetarian
                </Link>
              </li>
              <li>
                <Link to="/generator?category=desserts" className="text-gray-400 hover:text-secondary transition-colors duration-200">
                  Desserts
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact Us */}
          <div className="col-span-1">
            <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
            <address className="not-italic text-gray-400 space-y-2">
              <p>123 Recipe Street</p>
              <p>Chennai, Tamil Nadu 600001</p>
              <p>India</p>
              <p className="mt-4">
                <a href="tel:+919876543210" className="hover:text-secondary transition-colors duration-200">
                  +91 9876 543 210
                </a>
              </p>
              <p>
                <a href="mailto:info@nammarecipe.com" className="hover:text-secondary transition-colors duration-200">
                  info@nammarecipe.com
                </a>
              </p>
            </address>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {currentYear} Namma Recipe. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
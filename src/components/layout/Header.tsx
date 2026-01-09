import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, ShoppingCart, LogIn, LogOut, User, Menu, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useCartStore } from '../../store/cartStore';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, logout, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Recipe Generator', path: '/generator' },
  ];

  if (isAuthenticated) {
    navItems.push({ name: 'My Orders', path: '/orders' });
    if (user?.role === 'admin') {
      navItems.push({ name: 'Admin Dashboard', path: '/admin' });
    }
  }

  return (
    <header 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="container-custom mx-auto">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <motion.div
              whileHover={{ rotate: 10 }}
              className="mr-2 text-accent"
            >
              <ChefHat size={28} />
            </motion.div>
            <span className="font-display text-xl md:text-2xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Namma Recipe
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`font-medium transition-colors duration-200 hover:text-accent ${
                  location.pathname === item.path ? 'text-accent' : 'text-text'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Right side items */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to="/cart" className="relative">
                  <ShoppingCart className="text-text hover:text-accent transition-colors duration-200" />
                  {items.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {items.length}
                    </span>
                  )}
                </Link>
                <div className="flex items-center space-x-2">
                  <span className="font-medium">{user?.username}</span>
                  <button 
                    onClick={handleLogout}
                    className="btn-outline py-1 px-3 text-sm"
                  >
                    <LogOut size={16} className="inline mr-1" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link to="/login" className="btn-primary">
                <LogIn size={16} className="inline mr-1" />
                Login
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/cart" className="relative">
                <ShoppingCart className="text-text hover:text-accent transition-colors duration-200" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </Link>
            )}
            <button 
              onClick={toggleMenu}
              className="text-text hover:text-accent transition-colors duration-200"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <motion.div 
        className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isMenuOpen ? 'auto' : 0,
          opacity: isMenuOpen ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      >
        <div className="container-custom mx-auto py-4 bg-white shadow-lg rounded-b-lg">
          <nav className="flex flex-col space-y-4">
            {navItems.map((item) => (
              <Link 
                key={item.path} 
                to={item.path}
                className={`font-medium transition-colors duration-200 hover:text-accent ${
                  location.pathname === item.path ? 'text-accent' : 'text-text'
                }`}
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="pt-2 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    <span className="font-medium">{user?.username}</span>
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="btn-outline py-1 px-3 text-sm"
                  >
                    <LogOut size={16} className="inline mr-1" />
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="btn-primary w-full text-center">
                <LogIn size={16} className="inline mr-1" />
                Login
              </Link>
            )}
          </nav>
        </div>
      </motion.div>
    </header>
  );
};

export default Header;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { popularIngredients } from '../../data/mockRecipes';

interface RecipeSearchProps {
  onSearch: (query: string) => void;
  onFilterByIngredients: (ingredients: string[]) => void;
  initialQuery?: string;
  selectedIngredients?: string[];
}

const RecipeSearch: React.FC<RecipeSearchProps> = ({ 
  onSearch, 
  onFilterByIngredients,
  initialQuery = '',
  selectedIngredients = []
}) => {
  const [query, setQuery] = useState(initialQuery);
  const [showFilters, setShowFilters] = useState(false);
  const [ingredients, setIngredients] = useState<string[]>(selectedIngredients);
  const filtersRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Handle outside click to close filters
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filtersRef.current && !filtersRef.current.contains(event.target as Node)) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Update URL with search parameters
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    
    if (query) {
      params.set('query', query);
    } else {
      params.delete('query');
    }
    
    if (ingredients.length > 0) {
      params.set('ingredients', ingredients.join(','));
    } else {
      params.delete('ingredients');
    }
    
    // Update URL without reloading the page
    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState(null, '', newUrl);
    
  }, [query, ingredients, location.pathname]);

  const handleSearch = () => {
    onSearch(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const toggleIngredient = (ingredient: string) => {
    setIngredients(prev => {
      if (prev.includes(ingredient)) {
        // Remove ingredient
        const updated = prev.filter(ing => ing !== ingredient);
        onFilterByIngredients(updated);
        return updated;
      } else {
        // Add ingredient
        const updated = [...prev, ingredient];
        onFilterByIngredients(updated);
        return updated;
      }
    });
  };

  const clearFilters = () => {
    setIngredients([]);
    onFilterByIngredients([]);
  };

  const clearSearch = () => {
    setQuery('');
    onSearch('');
  };

  return (
    <div className="relative">
      <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-white shadow-sm">
        <div className="flex-1 flex items-center px-4">
          <Search size={18} className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search for recipes, ingredients, or dishes..."
            className="w-full py-3 focus:outline-none"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          {query && (
            <button 
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={18} />
            </button>
          )}
        </div>
        
        <button 
          className={`px-4 py-3 flex items-center border-l ${
            ingredients.length > 0 ? 'bg-primary text-white' : 'border-gray-300 hover:bg-gray-50'
          }`}
          onClick={() => setShowFilters(!showFilters)}
        >
          <Filter size={18} className="mr-1" />
          <span className="hidden sm:inline">Filter</span>
          {ingredients.length > 0 && (
            <span className="ml-1 bg-white text-primary text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {ingredients.length}
            </span>
          )}
        </button>
        
        <button 
          className="bg-primary text-white px-6 py-3 hover:bg-primary-dark transition-colors duration-200"
          onClick={handleSearch}
        >
          Search
        </button>
      </div>
      
      {/* Filters Dropdown */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            ref={filtersRef}
            className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-lg p-4 border border-gray-200"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold">Filter by Ingredients</h3>
              {ingredients.length > 0 && (
                <button 
                  onClick={clearFilters}
                  className="text-sm text-primary hover:text-primary-dark"
                >
                  Clear All
                </button>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
              {popularIngredients.map(ingredient => (
                <button
                  key={ingredient}
                  onClick={() => toggleIngredient(ingredient)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    ingredients.includes(ingredient) 
                      ? 'bg-primary text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {ingredient}
                  {ingredients.includes(ingredient) && (
                    <X size={14} className="inline ml-1" />
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeSearch;
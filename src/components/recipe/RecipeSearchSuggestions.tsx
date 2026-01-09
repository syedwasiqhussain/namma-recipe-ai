import React from 'react';
import { motion } from 'framer-motion';
import { popularIngredients } from '../../data/mockRecipes';

interface RecipeSearchSuggestionsProps {
  onSelect: (ingredient: string) => void;
}

const RecipeSearchSuggestions: React.FC<RecipeSearchSuggestionsProps> = ({ onSelect }) => {
  // Filter to show only 8 random popular ingredients
  const shuffled = [...popularIngredients].sort(() => 0.5 - Math.random());
  const selectedIngredients = shuffled.slice(0, 8);

  return (
    <div className="mt-6">
      <h3 className="text-sm font-medium text-gray-500 mb-3">Popular Ingredients</h3>
      
      <motion.div 
        className="flex flex-wrap gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {selectedIngredients.map((ingredient, index) => (
          <motion.button
            key={ingredient}
            onClick={() => onSelect(ingredient)}
            className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 text-sm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            {ingredient}
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
};

export default RecipeSearchSuggestions;
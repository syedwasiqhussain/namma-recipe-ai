import React from 'react';
import { motion } from 'framer-motion';
import RecipeCard from './RecipeCard';
import { Recipe } from '../../types/recipe';

interface RecipeListProps {
  recipes: Recipe[];
  title?: string;
  emptyMessage?: string;
}

const RecipeList: React.FC<RecipeListProps> = ({ 
  recipes, 
  title = 'Recipes', 
  emptyMessage = 'No recipes found. Try adjusting your search or filters.' 
}) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (recipes.length === 0) {
    return (
      <div className="py-8 text-center">
        <h2 className="heading-2 mb-4">{title}</h2>
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="py-8">
      {title && <h2 className="heading-2 mb-6">{title}</h2>}
      
      <motion.div 
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {recipes.map(recipe => (
          <motion.div key={recipe.id} variants={itemVariants}>
            <RecipeCard recipe={recipe} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default RecipeList;
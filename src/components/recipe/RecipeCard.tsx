import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Utensils, Star, Heart } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface RecipeCardProps {
  recipe: Recipe;
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <motion.div
      className="card h-full"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/recipe/${recipe.id}`} className="flex flex-col h-full">
        <div className="relative">
          <img 
            src={recipe.image} 
            alt={recipe.name} 
            className="w-full h-48 object-cover rounded-t-lg"
          />
          {recipe.isFeatured && (
            <div className="absolute top-2 left-2 bg-accent text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
              <Heart size={12} className="mr-1" />
              Featured
            </div>
          )}
          <div className="absolute bottom-2 right-2 bg-white/90 text-text text-xs font-bold px-2 py-1 rounded-full flex items-center">
            <Star size={12} className="text-yellow-500 mr-1" />
            {recipe.rating?.toFixed(1)} ({recipe.reviews})
          </div>
        </div>
        
        <div className="p-4 flex flex-col flex-grow">
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">{recipe.name}</h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <div className="flex items-center">
              <Clock size={14} className="mr-1" />
              <span>{recipe.preparationTime + recipe.cookingTime} mins</span>
            </div>
            <div className="flex items-center">
              <Utensils size={14} className="mr-1" />
              <span>{recipe.difficulty}</span>
            </div>
          </div>
          
          <div className="mt-auto">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">Price</p>
                <p className="font-semibold">₹{recipe.readyFoodPrice}</p>
              </div>
              <motion.button 
                className="btn-primary text-xs py-1 px-3"
                whileTap={{ scale: 0.95 }}
              >
                View Recipe
              </motion.button>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default RecipeCard;
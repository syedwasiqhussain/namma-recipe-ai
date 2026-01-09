import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Search, Sparkles } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import RecipeList from '../components/recipe/RecipeList';
import { useRecipeStore } from '../store/recipeStore';
import { Recipe } from '../types/recipe';

const HomePage: React.FC = () => {
  const { recipes, fetchAllRecipes, isLoading } = useRecipeStore();
  const [featuredRecipes, setFeaturedRecipes] = useState<Recipe[]>([]);
  const [traditionalRecipes, setTraditionalRecipes] = useState<Recipe[]>([]);
  const [fastFoodRecipes, setFastFoodRecipes] = useState<Recipe[]>([]);
  const navigate = useNavigate();
  
  useEffect(() => {
    fetchAllRecipes();
  }, [fetchAllRecipes]);
  
  useEffect(() => {
    if (recipes.length > 0) {
      // Get featured recipes
      const featured = recipes.filter(recipe => recipe.isFeatured).slice(0, 4);
      setFeaturedRecipes(featured);
      
      // Get traditional recipes
      const traditional = recipes
        .filter(recipe => recipe.category === 'traditional')
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setTraditionalRecipes(traditional);
      
      // Get fast food recipes
      const fastFood = recipes
        .filter(recipe => recipe.category === 'fastfood')
        .sort(() => 0.5 - Math.random())
        .slice(0, 4);
      setFastFoodRecipes(fastFood);
    }
  }, [recipes]);
  
  const handleSearchRedirect = () => {
    navigate('/generator');
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loader"></span>
      </div>
    );
  }
  
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-accent/5 to-primary/5 py-16 md:py-24">
        <div className="container-custom mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h1 className="text-4xl md:text-5xl font-bold text-text mb-6 font-display leading-tight">
                Discover the Authentic 
                <span className="bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent"> Tamil Nadu </span> 
                Flavors
              </h1>
              
              <p className="text-lg text-gray-600 mb-8">
                Generate delicious recipes from Tamil Nadu's rich culinary tradition. 
                Find the perfect dish based on your ingredients or preferences.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/generator" className="btn-primary flex items-center justify-center">
                  <Sparkles size={18} className="mr-2" />
                  Generate Recipe
                </Link>
                <button 
                  onClick={handleSearchRedirect}
                  className="btn-outline flex items-center justify-center"
                >
                  <Search size={18} className="mr-2" />
                  Search Recipes
                </button>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="rounded-lg overflow-hidden shadow-xl"
            >
              <img 
                src="https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg" 
                alt="Delicious Tamil Nadu Food" 
                className="w-full h-[400px] object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Featured Recipes */}
      <section className="section bg-white">
        <div className="container-custom mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="heading-2 flex items-center">
              <ChefHat size={24} className="text-accent mr-2" />
              Featured Recipes
            </h2>
            <Link to="/generator" className="text-primary hover:text-primary-dark font-medium">
              View All
            </Link>
          </div>
          
          <RecipeList recipes={featuredRecipes} title="" />
        </div>
      </section>
      
      {/* Traditional Recipes */}
      <section className="section bg-gray-50">
        <div className="container-custom mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="heading-2">Traditional Tamil Delicacies</h2>
            <Link to="/generator?category=traditional" className="text-primary hover:text-primary-dark font-medium">
              View All
            </Link>
          </div>
          
          <RecipeList recipes={traditionalRecipes} title="" />
        </div>
      </section>
      
      {/* Fast Food Section */}
      <section className="section bg-white">
        <div className="container-custom mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="heading-2">Tamil Style Fast Food</h2>
            <Link to="/generator?category=fastfood" className="text-primary hover:text-primary-dark font-medium">
              View All
            </Link>
          </div>
          
          <RecipeList recipes={fastFoodRecipes} title="" />
        </div>
      </section>
      
      {/* How It Works */}
      <section className="section bg-gradient-to-r from-primary/5 to-secondary/5">
        <div className="container-custom mx-auto">
          <h2 className="heading-2 text-center mb-12">How It Works</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles size={24} className="text-accent" />
              </div>
              <h3 className="heading-3 mb-3">Generate Recipe</h3>
              <p className="text-gray-600">
                Tell our AI what ingredients you have or what you're craving, and it will generate the perfect recipe for you.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <ChefHat size={24} className="text-primary" />
              </div>
              <h3 className="heading-3 mb-3">Choose Your Option</h3>
              <p className="text-gray-600">
                Decide whether you want to order just the ingredients or the complete ready-made dish delivered to your doorstep.
              </p>
            </motion.div>
            
            <motion.div 
              className="bg-white p-6 rounded-lg shadow-md text-center"
              whileHover={{ y: -5 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search size={24} className="text-secondary" />
              </div>
              <h3 className="heading-3 mb-3">Explore More</h3>
              <p className="text-gray-600">
                Browse our extensive collection of Tamil Nadu recipes, from traditional classics to modern favorites.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
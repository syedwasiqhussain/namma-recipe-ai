import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRecipeStore } from '../store/recipeStore';
import RecipeSearch from '../components/recipe/RecipeSearch';
import RecipeList from '../components/recipe/RecipeList';
import RecipeSearchSuggestions from '../components/recipe/RecipeSearchSuggestions';
import RecipeGeneratorComponent from '../components/recipe/RecipeGenerator';
import { Recipe } from '../types/recipe';

const RecipeGeneratorPage: React.FC = () => {
  const { 
    recipes,
    filteredRecipes, 
    currentSearch, 
    selectedIngredients,
    fetchAllRecipes, 
    searchRecipes, 
    filterByIngredients,
    generateRecipe,
    isLoading
  } = useRecipeStore();
  
  const [showGenerator, setShowGenerator] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    fetchAllRecipes();
    
    // Parse URL parameters
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query');
    const ingredientsParam = params.get('ingredients');
    const categoryParam = params.get('category');
    
    if (queryParam) {
      searchRecipes(queryParam);
    }
    
    if (ingredientsParam) {
      const ingredients = ingredientsParam.split(',');
      filterByIngredients(ingredients);
    }
    
    if (categoryParam) {
      // Filter by category
      const categoryRecipes = recipes.filter(recipe => recipe.category === categoryParam);
      // We can't directly set filteredRecipes, so let's use a search term that will match the category
      searchRecipes(categoryParam);
    }
  }, [fetchAllRecipes, location.search]);
  
  const handleSearch = (query: string) => {
    searchRecipes(query);
  };
  
  const handleFilterByIngredients = (ingredients: string[]) => {
    filterByIngredients(ingredients);
  };
  
  const handleSelectIngredient = (ingredient: string) => {
    const updatedIngredients = [...selectedIngredients, ingredient];
    filterByIngredients(updatedIngredients);
  };
  
  const handleSelectRecipe = (recipe: Recipe) => {
    navigate(`/recipe/${recipe.id}`);
  };
  
  if (isLoading && recipes.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loader"></span>
      </div>
    );
  }
  
  return (
    <div className="section bg-background">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="max-w-3xl mx-auto mb-8">
            <h1 className="heading-1 text-center mb-4">Find Your Perfect Tamil Nadu Recipe</h1>
            <p className="text-lg text-gray-600 text-center mb-8">
              Search for recipes, filter by ingredients, or let our AI generate the perfect recipe for you!
            </p>
            
            <div className="flex justify-center mb-6">
              <button
                className={`px-4 py-2 rounded-l-md font-medium ${
                  !showGenerator 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowGenerator(false)}
              >
                Search Recipes
              </button>
              <button
                className={`px-4 py-2 rounded-r-md font-medium ${
                  showGenerator 
                    ? 'bg-primary text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setShowGenerator(true)}
              >
                AI Generator
              </button>
            </div>
            
            {!showGenerator ? (
              <>
                <RecipeSearch 
                  onSearch={handleSearch} 
                  onFilterByIngredients={handleFilterByIngredients}
                  initialQuery={currentSearch}
                  selectedIngredients={selectedIngredients}
                />
                
                {!currentSearch && selectedIngredients.length === 0 && (
                  <RecipeSearchSuggestions onSelect={handleSelectIngredient} />
                )}
              </>
            ) : (
              <RecipeGeneratorComponent 
                onGenerate={generateRecipe}
                onSelectRecipe={handleSelectRecipe}
              />
            )}
          </div>
          
          {!showGenerator && (
            <RecipeList 
              recipes={filteredRecipes} 
              title="Recipes"
              emptyMessage="No recipes found matching your criteria. Try adjusting your search or filters."
            />
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default RecipeGeneratorPage;
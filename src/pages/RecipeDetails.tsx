import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { Clock, Utensils, User, Star, ShoppingCart, PlayCircle } from 'lucide-react';
import YouTube from 'react-youtube';
import { useRecipeStore } from '../store/recipeStore';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { Recipe } from '../types/recipe';

const RecipeDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { fetchRecipeById, isLoading } = useRecipeStore();
  const { addToCart } = useCartStore();
  const { isAuthenticated } = useAuthStore();
  
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  
  useEffect(() => {
    const loadRecipe = async () => {
      if (id) {
        const recipeData = await fetchRecipeById(id);
        if (recipeData) {
          setRecipe(recipeData);
        } else {
          navigate('/not-found');
        }
      }
    };
    
    loadRecipe();
  }, [id, fetchRecipeById, navigate]);
  
  const handleAddToCart = (type: 'ingredients' | 'readyFood') => {
    if (!isAuthenticated) {
      toast.info('Please login to add items to your cart', {
        position: 'bottom-right',
        autoClose: 3000,
      });
      navigate('/login');
      return;
    }
    
    if (recipe) {
      addToCart(recipe, type);
      toast.success(`Added ${recipe.name} ${type === 'ingredients' ? 'ingredients' : 'ready food'} to cart!`, {
        position: 'bottom-right',
        autoClose: 3000,
      });
    }
  };
  
  if (isLoading || !recipe) {
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
          {/* Hero Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="h-64 md:h-auto">
                <img 
                  src={recipe.image} 
                  alt={recipe.name} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="p-8">
                <div className="flex items-center mb-2">
                  <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full">
                    {recipe.category}
                  </span>
                  <div className="ml-auto flex items-center">
                    <Star size={16} className="text-yellow-500 mr-1" />
                    <span>{recipe.rating?.toFixed(1)} ({recipe.reviews} reviews)</span>
                  </div>
                </div>
                
                <h1 className="heading-1 mb-3">{recipe.name}</h1>
                <p className="text-gray-600 mb-6">{recipe.description}</p>
                
                <div className="flex flex-wrap gap-4 mb-6">
                  <div className="flex items-center">
                    <Clock size={18} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Prep + Cook</p>
                      <p className="font-medium">{recipe.preparationTime + recipe.cookingTime} mins</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Utensils size={18} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Difficulty</p>
                      <p className="font-medium capitalize">{recipe.difficulty}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <User size={18} className="text-gray-500 mr-2" />
                    <div>
                      <p className="text-sm text-gray-500">Servings</p>
                      <p className="font-medium">{recipe.servings} person</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1 border border-gray-200 rounded-md p-4 text-center">
                    <h3 className="font-medium mb-1">Ingredients Only</h3>
                    <p className="text-2xl font-bold mb-2">₹{recipe.ingredientsPrice}</p>
                    <button 
                      className="btn-outline w-full"
                      onClick={() => handleAddToCart('ingredients')}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Add to Cart
                    </button>
                  </div>
                  
                  <div className="flex-1 border border-accent rounded-md p-4 text-center bg-accent/5">
                    <h3 className="font-medium mb-1">Ready-made Food</h3>
                    <p className="text-2xl font-bold mb-2">₹{recipe.readyFoodPrice}</p>
                    <button 
                      className="btn-accent w-full"
                      onClick={() => handleAddToCart('readyFood')}
                    >
                      <ShoppingCart size={16} className="mr-1" />
                      Order Now
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recipe Content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Ingredients */}
            <div className="md:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="heading-2 mb-4">Ingredients</h2>
                <ul className="space-y-3">
                  {recipe.ingredients.map((ingredient) => (
                    <li key={ingredient.id} className="flex items-start">
                      <span className="w-2 h-2 bg-primary rounded-full mt-2 mr-2"></span>
                      <span className="flex-grow">
                        <span className="font-medium">{ingredient.name}</span>
                        <span className="text-gray-600"> - {ingredient.quantity}</span>
                        {ingredient.notes && (
                          <span className="block text-sm text-gray-500 mt-1">{ingredient.notes}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {/* Instructions */}
            <div className="md:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="heading-2 mb-4">Cooking Instructions</h2>
                <ol className="space-y-6">
                  {recipe.steps.map((step, index) => (
                    <li key={step.id} className="flex">
                      <div className="mr-4 flex-shrink-0">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                          {index + 1}
                        </div>
                      </div>
                      <div>
                        <p>{step.instruction}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
              
              {/* Video Tutorial */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="heading-2 mb-4">Video Tutorial</h2>
                
                {!isVideoPlaying ? (
                  <div 
                    className="relative rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    <img 
                      src={`https://img.youtube.com/vi/${recipe.youtubeVideoId}/maxresdefault.jpg`}
                      alt={`${recipe.name} Tutorial`}
                      className="w-full h-auto"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-primary/90 flex items-center justify-center">
                        <PlayCircle size={32} className="text-white" />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="aspect-w-16 aspect-h-9">
                    <YouTube
                      videoId={recipe.youtubeVideoId}
                      opts={{
                        width: '100%',
                        playerVars: {
                          autoplay: 1,
                        },
                      }}
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default RecipeDetails;
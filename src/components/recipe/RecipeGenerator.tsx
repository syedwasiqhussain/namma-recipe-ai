import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ChefHat, Check, Loader2 } from 'lucide-react';
import { Recipe } from '../../types/recipe';

interface RecipeGeneratorProps {
  onGenerate: (prompt: string) => Promise<Recipe | null>;
  onSelectRecipe: (recipe: Recipe) => void;
}

const RecipeGenerator: React.FC<RecipeGeneratorProps> = ({ onGenerate, onSelectRecipe }) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [generationSteps, setGenerationSteps] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(-1);

  const steps = [
    "Analyzing your ingredients and preferences...",
    "Searching through traditional Tamil Nadu recipes...",
    "Considering cooking techniques and flavor profiles...",
    "Finding the perfect balance of spices...",
    "Estimating preparation and cooking time...",
    "Finalizing recipe details...",
    "Recipe found! Preparing to display..."
  ];

  useEffect(() => {
    if (isGenerating && currentStepIndex < steps.length - 1) {
      const timer = setTimeout(() => {
        setCurrentStepIndex(prev => prev + 1);
        setGenerationSteps(prev => [...prev, steps[currentStepIndex + 1]]);
      }, 700);
      
      return () => clearTimeout(timer);
    }
  }, [isGenerating, currentStepIndex, steps]);

  const handleGenerate = async () => {
    if (!prompt.trim() || isGenerating) return;
    
    setIsGenerating(true);
    setGeneratedRecipe(null);
    setGenerationSteps([steps[0]]);
    setCurrentStepIndex(0);
    
    try {
      const recipe = await onGenerate(prompt);
      
      // Add a small delay before showing the result for better UX
      setTimeout(() => {
        setGeneratedRecipe(recipe);
        setIsGenerating(false);
      }, 1500);
      
    } catch (error) {
      console.error('Error generating recipe:', error);
      setIsGenerating(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleGenerate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h3 className="heading-3 mb-2 flex items-center">
          <Sparkles size={20} className="text-secondary mr-2" />
          AI Recipe Generator
        </h3>
        <p className="text-gray-600">
          Describe what you're looking for or list ingredients you have, and our AI will find the perfect Tamil Nadu recipe for you!
        </p>
      </div>
      
      <div className="mb-6">
        <textarea
          className="input min-h-24"
          placeholder="E.g., 'I want a spicy chicken recipe' or 'I have rice, tomatoes, and curry leaves'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isGenerating}
        />
      </div>
      
      <div className="flex justify-end">
        <button
          className="btn-primary flex items-center"
          onClick={handleGenerate}
          disabled={!prompt.trim() || isGenerating}
        >
          {isGenerating ? (
            <>
              <Loader2 size={18} className="mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <ChefHat size={18} className="mr-2" />
              Generate Recipe
            </>
          )}
        </button>
      </div>
      
      {/* Recipe Generation Animation */}
      <AnimatePresence>
        {isGenerating && (
          <motion.div 
            className="mt-6 p-4 bg-gray-50 rounded-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="flex items-center mb-3">
              <div className="loader mr-3" style={{ width: '24px', height: '24px' }}></div>
              <h4 className="font-medium">Generating Your Recipe</h4>
            </div>
            
            <div className="space-y-2">
              {generationSteps.map((step, index) => (
                <motion.div 
                  key={index}
                  className="flex items-start"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check size={16} className="text-success mt-1 mr-2" />
                  <p className="text-sm text-gray-600">{step}</p>
                </motion.div>
              ))}
              
              {currentStepIndex < steps.length - 1 && (
                <div className="flex items-start">
                  <div className="w-4 h-4 mt-1 mr-2" />
                  <p className="text-sm text-gray-600 typing-animation">
                    {/* This will show the animated typing effect */}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Generated Recipe Result */}
      <AnimatePresence>
        {generatedRecipe && !isGenerating && (
          <motion.div 
            className="mt-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="border border-success/30 bg-success/5 rounded-lg p-4 mb-4">
              <h4 className="font-medium text-success flex items-center mb-2">
                <Sparkles size={18} className="mr-2" />
                Perfect Match Found!
              </h4>
              <p className="text-gray-700 mb-3">
                Based on your input, we've found the perfect Tamil Nadu recipe for you:
              </p>
              <h3 className="font-bold text-xl mb-2">{generatedRecipe.name}</h3>
              <p className="text-gray-600 mb-4">{generatedRecipe.description}</p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  className="btn-primary flex-1 flex justify-center"
                  onClick={() => onSelectRecipe(generatedRecipe)}
                >
                  View Complete Recipe
                </button>
                <button 
                  className="btn-outline flex-1 flex justify-center"
                  onClick={() => setGeneratedRecipe(null)}
                >
                  Generate Another
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RecipeGenerator;
import { create } from 'zustand';
import { Recipe } from '../types/recipe';
import { mockRecipes } from '../data/mockRecipes';

interface RecipeState {
  recipes: Recipe[];
  filteredRecipes: Recipe[];
  isLoading: boolean;
  error: string | null;
  currentSearch: string;
  selectedIngredients: string[];
  
  // Actions
  fetchAllRecipes: () => Promise<void>;
  fetchRecipeById: (id: string) => Promise<Recipe | undefined>;
  searchRecipes: (query: string) => void;
  filterByIngredients: (ingredients: string[]) => void;
  generateRecipe: (prompt: string) => Promise<Recipe | null>;
  clearFilters: () => void;
}

export const useRecipeStore = create<RecipeState>((set, get) => ({
  recipes: [],
  filteredRecipes: [],
  isLoading: false,
  error: null,
  currentSearch: '',
  selectedIngredients: [],
  
  fetchAllRecipes: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      set({ 
        recipes: mockRecipes,
        filteredRecipes: mockRecipes,
        isLoading: false 
      });
    } catch (error) {
      set({ 
        error: 'Failed to fetch recipes',
        isLoading: false 
      });
      console.error('Error fetching recipes:', error);
    }
  },
  
  fetchRecipeById: async (id) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const recipe = mockRecipes.find(r => r.id === id);
      set({ isLoading: false });
      
      return recipe;
    } catch (error) {
      set({ 
        error: 'Failed to fetch recipe',
        isLoading: false 
      });
      console.error('Error fetching recipe:', error);
      return undefined;
    }
  },
  
  searchRecipes: (query) => {
    const { recipes, selectedIngredients } = get();
    set({ currentSearch: query });
    
    let filtered = recipes;
    
    // Filter by search query if provided
    if (query) {
      const lowerQuery = query.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery) ||
        recipe.ingredients.some(ing => ing.name.toLowerCase().includes(lowerQuery))
      );
    }
    
    // Apply ingredient filters if any are selected
    if (selectedIngredients.length > 0) {
      filtered = filtered.filter(recipe => 
        selectedIngredients.some(ing => 
          recipe.ingredients.some(i => i.name.toLowerCase().includes(ing.toLowerCase()))
        )
      );
    }
    
    set({ filteredRecipes: filtered });
  },
  
  filterByIngredients: (ingredients) => {
    const { recipes, currentSearch } = get();
    set({ selectedIngredients: ingredients });
    
    let filtered = recipes;
    
    // Apply ingredient filters
    if (ingredients.length > 0) {
      filtered = filtered.filter(recipe => 
        ingredients.some(ing => 
          recipe.ingredients.some(i => i.name.toLowerCase().includes(ing.toLowerCase()))
        )
      );
    }
    
    // Apply search query if exists
    if (currentSearch) {
      const lowerQuery = currentSearch.toLowerCase();
      filtered = filtered.filter(recipe => 
        recipe.name.toLowerCase().includes(lowerQuery) ||
        recipe.description.toLowerCase().includes(lowerQuery)
      );
    }
    
    set({ filteredRecipes: filtered });
  },
  
  generateRecipe: async (prompt) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate AI generation delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const { recipes } = get();
      
      // Logic to find a relevant recipe based on the prompt
      const lowerPrompt = prompt.toLowerCase();
      const keywords = lowerPrompt.split(/[\s,]+/);
      
      // Find recipes that match most keywords
      const scoredRecipes = recipes.map(recipe => {
        let score = 0;
        const recipeText = `${recipe.name} ${recipe.description} ${recipe.ingredients.map(i => i.name).join(' ')}`.toLowerCase();
        
        keywords.forEach(keyword => {
          if (recipeText.includes(keyword)) {
            score += 1;
          }
        });
        
        return { recipe, score };
      });
      
      // Sort by score and get the best match
      scoredRecipes.sort((a, b) => b.score - a.score);
      
      // If we have a decent match (score > 0)
      if (scoredRecipes.length > 0 && scoredRecipes[0].score > 0) {
        set({ isLoading: false });
        return scoredRecipes[0].recipe;
      }
      
      // Fallback to a random recipe if no good match
      const randomIndex = Math.floor(Math.random() * recipes.length);
      set({ isLoading: false });
      return recipes[randomIndex];
      
    } catch (error) {
      set({ 
        error: 'Failed to generate recipe',
        isLoading: false 
      });
      console.error('Error generating recipe:', error);
      return null;
    }
  },
  
  clearFilters: () => {
    const { recipes } = get();
    set({ 
      filteredRecipes: recipes,
      currentSearch: '',
      selectedIngredients: [] 
    });
  }
}));
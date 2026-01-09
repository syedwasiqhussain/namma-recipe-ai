export interface Ingredient {
  id: string;
  name: string;
  quantity: string;
  notes?: string;
}

export interface Step {
  id: string;
  instruction: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  image: string;
  category: 'traditional' | 'fastfood' | 'vegetarian' | 'nonvegetarian' | 'dessert';
  preparationTime: number; // in minutes
  cookingTime: number; // in minutes
  servings: number;
  difficulty: 'easy' | 'medium' | 'hard';
  ingredients: Ingredient[];
  steps: Step[];
  ingredientsPrice: number; // in rupees
  readyFoodPrice: number; // in rupees
  youtubeVideoId: string;
  tags: string[];
  isFeatured?: boolean;
  rating?: number; // 1-5
  reviews?: number; // number of reviews
}

export interface GenerateRecipeFormData {
  ingredients: string[];
  dietaryPreferences: string[];
  cookingTime?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}
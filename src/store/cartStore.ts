import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Recipe } from '../types/recipe';

export type CartItemType = 'ingredients' | 'readyFood';

export interface CartItem {
  id: string;
  recipeId: string;
  recipeName: string;
  type: CartItemType;
  price: number;
  quantity: number;
  image: string;
}

interface CartState {
  items: CartItem[];
  addToCart: (recipe: Recipe, type: CartItemType) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addToCart: (recipe, type) => {
        const { items } = get();
        const itemId = `${recipe.id}-${type}`;
        
        const existingItemIndex = items.findIndex(item => item.id === itemId);
        
        if (existingItemIndex !== -1) {
          // Update quantity of existing item
          const updatedItems = [...items];
          updatedItems[existingItemIndex].quantity += 1;
          set({ items: updatedItems });
        } else {
          // Add new item
          const price = type === 'ingredients' ? recipe.ingredientsPrice : recipe.readyFoodPrice;
          
          const newItem: CartItem = {
            id: itemId,
            recipeId: recipe.id,
            recipeName: recipe.name,
            type,
            price,
            quantity: 1,
            image: recipe.image
          };
          
          set({ items: [...items, newItem] });
        }
      },
      
      removeFromCart: (id) => {
        const { items } = get();
        set({ items: items.filter(item => item.id !== id) });
      },
      
      updateQuantity: (id, quantity) => {
        const { items } = get();
        const updatedItems = items.map(item => 
          item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
        );
        
        set({ items: updatedItems });
      },
      
      clearCart: () => {
        set({ items: [] });
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.price * item.quantity), 0);
      }
    }),
    {
      name: 'namma-recipe-cart',
    }
  )
);
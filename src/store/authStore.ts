import { create } from 'zustand';

interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

// Mock user data
const MOCK_USERS = [
  { id: '1', username: 'nammarecipe', password: 'user', role: 'user' as const },
  { id: '2', username: 'nammarecipe', password: 'admin', role: 'admin' as const }
];

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (username: string, password: string) => {
    try {
      // Simulating API call delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const user = MOCK_USERS.find(
        u => u.username === username && u.password === password
      );
      
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        localStorage.setItem('user', JSON.stringify(userWithoutPassword));
        set({ user: userWithoutPassword, isAuthenticated: true });
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  checkAuth: () => {
    set({ isLoading: true });
    
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        set({ user, isAuthenticated: true });
      }
    } catch (error) {
      console.error('Auth check error:', error);
    } finally {
      set({ isLoading: false });
    }
  }
}));
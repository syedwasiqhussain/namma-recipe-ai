import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem } from './cartStore';

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'completed' | 'rejected';

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
  address?: string;
  contactNumber?: string;
}

interface OrderState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  
  // Actions
  createOrder: (userId: string, items: CartItem[], address: string, contactNumber: string) => Promise<string>;
  fetchUserOrders: (userId: string) => Promise<Order[]>;
  fetchAllOrders: () => Promise<Order[]>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
  getRevenueStats: () => { total: number; confirmed: number; rejected: number };
}

// Generate a UUID for order IDs
const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      isLoading: false,
      error: null,
      
      createOrder: async (userId, items, address, contactNumber) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          const totalAmount = items.reduce((total, item) => total + (item.price * item.quantity), 0);
          
          const newOrder: Order = {
            id: generateId(),
            userId,
            items,
            totalAmount,
            status: 'pending',
            createdAt: new Date().toISOString(),
            address,
            contactNumber
          };
          
          set(state => ({
            orders: [...state.orders, newOrder],
            isLoading: false
          }));
          
          return newOrder.id;
        } catch (error) {
          set({ 
            error: 'Failed to create order',
            isLoading: false 
          });
          console.error('Error creating order:', error);
          throw error;
        }
      },
      
      fetchUserOrders: async (userId) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { orders } = get();
          const userOrders = orders.filter(order => order.userId === userId);
          
          // Sort by date, newest first
          userOrders.sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          set({ isLoading: false });
          return userOrders;
        } catch (error) {
          set({ 
            error: 'Failed to fetch orders',
            isLoading: false 
          });
          console.error('Error fetching orders:', error);
          return [];
        }
      },
      
      fetchAllOrders: async () => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          const { orders } = get();
          
          // Sort by date, newest first
          const sortedOrders = [...orders].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          set({ isLoading: false });
          return sortedOrders;
        } catch (error) {
          set({ 
            error: 'Failed to fetch all orders',
            isLoading: false 
          });
          console.error('Error fetching all orders:', error);
          return [];
        }
      },
      
      updateOrderStatus: async (orderId, status) => {
        set({ isLoading: true, error: null });
        
        try {
          // Simulate API delay
          await new Promise(resolve => setTimeout(resolve, 800));
          
          set(state => ({
            orders: state.orders.map(order => 
              order.id === orderId 
                ? { ...order, status } 
                : order
            ),
            isLoading: false
          }));
          
          return true;
        } catch (error) {
          set({ 
            error: 'Failed to update order status',
            isLoading: false 
          });
          console.error('Error updating order status:', error);
          return false;
        }
      },
      
      getRevenueStats: () => {
        const { orders } = get();
        
        const total = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        
        const confirmed = orders
          .filter(order => ['confirmed', 'processing', 'completed'].includes(order.status))
          .reduce((sum, order) => sum + order.totalAmount, 0);
          
        const rejected = orders
          .filter(order => order.status === 'rejected')
          .reduce((sum, order) => sum + order.totalAmount, 0);
          
        return { total, confirmed, rejected };
      }
    }),
    {
      name: 'namma-recipe-orders',
    }
  )
);
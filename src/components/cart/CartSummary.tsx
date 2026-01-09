import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ArrowRight, CheckCircle } from 'lucide-react';
import { useCartStore } from '../../store/cartStore';

interface CartSummaryProps {
  totalPrice: number;
  onCheckout: () => void;
  isProcessing: boolean;
}

const CartSummary: React.FC<CartSummaryProps> = ({ totalPrice, onCheckout, isProcessing }) => {
  const { items } = useCartStore();
  
  // Count items by type
  const ingredientsCount = items.filter(item => item.type === 'ingredients').length;
  const readyFoodCount = items.filter(item => item.type === 'readyFood').length;
  
  // Apply delivery fee if cart has items
  const deliveryFee = items.length > 0 ? 50 : 0;
  
  // 5% tax
  const tax = totalPrice * 0.05;
  
  // Final total
  const finalTotal = totalPrice + deliveryFee + tax;
  
  return (
    <motion.div 
      className="bg-white rounded-lg shadow-md p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="heading-3 mb-4 flex items-center">
        <ShoppingBag size={22} className="mr-2 text-primary" />
        Order Summary
      </h3>
      
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">Items ({items.length})</span>
          <span>{ingredientsCount > 0 && `${ingredientsCount} Ingredients`}</span>
          <span>{readyFoodCount > 0 && `${readyFoodCount} Ready Meals`}</span>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-4 mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-2">
          <span className="text-gray-600">Delivery Fee</span>
          <span className="font-medium">₹{deliveryFee.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between mb-4">
          <span className="text-gray-600">Tax (5%)</span>
          <span className="font-medium">₹{tax.toFixed(2)}</span>
        </div>
        
        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>₹{finalTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <button 
        className="btn-primary w-full flex items-center justify-center"
        onClick={onCheckout}
        disabled={items.length === 0 || isProcessing}
      >
        {isProcessing ? (
          <span className="loader" style={{ width: '20px', height: '20px' }}></span>
        ) : (
          <>
            Proceed to Checkout
            <ArrowRight size={18} className="ml-2" />
          </>
        )}
      </button>
      
      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 flex items-center justify-center">
          <CheckCircle size={14} className="text-success mr-1" />
          Secure checkout powered by COD
        </p>
      </div>
    </motion.div>
  );
};

export default CartSummary;
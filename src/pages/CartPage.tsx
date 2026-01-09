import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import CheckoutForm from '../components/cart/CheckoutForm';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const CartPage: React.FC = () => {
  const { items, removeFromCart, updateQuantity, clearCart, getTotalPrice } = useCartStore();
  const { user } = useAuthStore();
  const { createOrder } = useOrderStore();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty. Add some items before checkout.');
      return;
    }
    
    setIsCheckingOut(true);
  };
  
  const handleCancelCheckout = () => {
    setIsCheckingOut(false);
  };
  
  const handlePlaceOrder = async (address: string, contactNumber: string) => {
    if (!user) return false;
    
    setIsProcessing(true);
    
    try {
      await createOrder(user.id, items, address, contactNumber);
      clearCart();
      setIsCheckingOut(false);
      return true;
    } catch (error) {
      console.error('Error placing order:', error);
      return false;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <div className="section bg-background">
      <div className="container-custom mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center mb-8">
            <Link to="/" className="text-primary hover:text-primary-dark mr-4">
              <ArrowLeft size={20} />
            </Link>
            <h1 className="heading-1 flex items-center">
              <ShoppingCart size={28} className="mr-2 text-primary" />
              {isCheckingOut ? 'Checkout' : 'Shopping Cart'}
            </h1>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {isCheckingOut ? (
                  <CheckoutForm 
                    onSubmit={handlePlaceOrder}
                    onCancel={handleCancelCheckout}
                  />
                ) : (
                  <motion.div 
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {items.length === 0 ? (
                      <div className="p-8 text-center">
                        <div className="flex justify-center mb-4">
                          <ShoppingBag size={64} className="text-gray-300" />
                        </div>
                        <h2 className="heading-3 mb-2">Your cart is empty</h2>
                        <p className="text-gray-600 mb-6">
                          Looks like you haven't added any items to your cart yet.
                        </p>
                        <Link to="/generator" className="btn-primary">
                          Browse Recipes
                        </Link>
                      </div>
                    ) : (
                      <>
                        <div className="p-4 border-b border-gray-200 bg-gray-50">
                          <div className="flex justify-between items-center">
                            <h3 className="font-medium">Shopping Cart ({items.length} items)</h3>
                            <button 
                              className="text-sm text-primary hover:text-primary-dark"
                              onClick={() => clearCart()}
                            >
                              Clear Cart
                            </button>
                          </div>
                        </div>
                        
                        <div>
                          <AnimatePresence>
                            {items.map(item => (
                              <CartItem 
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeFromCart}
                              />
                            ))}
                          </AnimatePresence>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            <div className="lg:col-span-1">
              <CartSummary 
                totalPrice={getTotalPrice()}
                onCheckout={handleCheckout}
                isProcessing={isProcessing}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
import React from 'react';
import { motion } from 'framer-motion';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { CartItem as CartItemType } from '../../store/cartStore';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

const CartItem: React.FC<CartItemProps> = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <motion.div 
      className="flex items-center p-4 border-b border-gray-200 last:border-0"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
    >
      <div className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-md overflow-hidden">
        <img 
          src={item.image} 
          alt={item.recipeName} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="ml-4 flex-grow">
        <h4 className="font-medium">{item.recipeName}</h4>
        <p className="text-sm text-gray-500">
          {item.type === 'ingredients' ? 'Ingredients Only' : 'Ready-made Food'}
        </p>
      </div>
      
      <div className="flex items-center ml-4">
        <button 
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
          disabled={item.quantity <= 1}
        >
          <Minus size={16} className="text-gray-600" />
        </button>
        
        <span className="mx-3 w-6 text-center">{item.quantity}</span>
        
        <button 
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
        >
          <Plus size={16} className="text-gray-600" />
        </button>
      </div>
      
      <div className="ml-6 text-right min-w-24">
        <p className="font-semibold">₹{item.price * item.quantity}</p>
        <p className="text-xs text-gray-500">₹{item.price} each</p>
      </div>
      
      <button 
        className="ml-4 text-gray-400 hover:text-error transition-colors duration-200"
        onClick={() => onRemove(item.id)}
      >
        <Trash2 size={18} />
      </button>
    </motion.div>
  );
};

export default CartItem;
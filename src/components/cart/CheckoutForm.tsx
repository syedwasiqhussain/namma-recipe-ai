import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, Send, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';

interface CheckoutFormProps {
  onSubmit: (address: string, contactNumber: string) => Promise<boolean>;
  onCancel: () => void;
}

const CheckoutForm: React.FC<CheckoutFormProps> = ({ onSubmit, onCancel }) => {
  const [address, setAddress] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [errors, setErrors] = useState({ address: '', contactNumber: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const validateForm = () => {
    const newErrors = { address: '', contactNumber: '' };
    let isValid = true;
    
    if (!address.trim()) {
      newErrors.address = 'Delivery address is required';
      isValid = false;
    }
    
    if (!contactNumber.trim()) {
      newErrors.contactNumber = 'Contact number is required';
      isValid = false;
    } else if (!/^\d{10}$/.test(contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit contact number';
      isValid = false;
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const success = await onSubmit(address, contactNumber);
      
      if (success) {
        toast.success('Order placed successfully!');
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h3 className="heading-3 mb-4">Delivery Details</h3>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Delivery Address
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MapPin size={18} className="text-gray-400" />
            </div>
            <textarea
              id="address"
              className="input pl-10 min-h-24"
              placeholder="Enter your full delivery address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          {errors.address && (
            <p className="text-error text-sm mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.address}
            </p>
          )}
        </div>
        
        <div className="mb-6">
          <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Contact Number
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone size={18} className="text-gray-400" />
            </div>
            <input
              id="contactNumber"
              type="tel"
              className="input pl-10"
              placeholder="Enter your 10-digit phone number"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
              disabled={isSubmitting}
            />
          </div>
          {errors.contactNumber && (
            <p className="text-error text-sm mt-1 flex items-center">
              <AlertCircle size={14} className="mr-1" />
              {errors.contactNumber}
            </p>
          )}
        </div>
        
        <div className="flex justify-between">
          <button 
            type="button" 
            className="btn-outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Back to Cart
          </button>
          
          <button 
            type="submit" 
            className="btn-primary flex items-center"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span className="loader" style={{ width: '20px', height: '20px' }}></span>
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Place Order
              </>
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default CheckoutForm;
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { PackageCheck, ArrowLeft, ShoppingBag, Truck, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useOrderStore, Order } from '../store/orderStore';
import { useAuthStore } from '../store/authStore';

const OrdersPage: React.FC = () => {
  const { fetchUserOrders, isLoading } = useOrderStore();
  const { user } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    const loadOrders = async () => {
      if (user) {
        const userOrders = await fetchUserOrders(user.id);
        setOrders(userOrders);
      }
    };
    
    loadOrders();
  }, [fetchUserOrders, user]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-warning" />;
      case 'confirmed':
        return <ShoppingBag size={18} className="text-success" />;
      case 'processing':
        return <Truck size={18} className="text-primary" />;
      case 'completed':
        return <PackageCheck size={18} className="text-success" />;
      case 'rejected':
        return <Clock size={18} className="text-error" />;
      default:
        return <Clock size={18} className="text-warning" />;
    }
  };
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/30';
      case 'confirmed':
        return 'bg-success/10 text-success border-success/30';
      case 'processing':
        return 'bg-primary/10 text-primary border-primary/30';
      case 'completed':
        return 'bg-success/10 text-success border-success/30';
      case 'rejected':
        return 'bg-error/10 text-error border-error/30';
      default:
        return 'bg-gray-100 text-gray-600 border-gray-300';
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loader"></span>
      </div>
    );
  }
  
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
              <PackageCheck size={28} className="mr-2 text-primary" />
              My Orders
            </h1>
          </div>
          
          {orders.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="flex justify-center mb-4">
                <ShoppingBag size={64} className="text-gray-300" />
              </div>
              <h2 className="heading-3 mb-2">No orders yet</h2>
              <p className="text-gray-600 mb-6">
                You haven't placed any orders yet. Start exploring delicious Tamil Nadu recipes!
              </p>
              <Link to="/generator" className="btn-primary">
                Browse Recipes
              </Link>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map(order => (
                <motion.div 
                  key={order.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <div>
                      <span className="text-sm text-gray-500">Order ID:</span>
                      <span className="ml-2 font-medium">#{order.id.slice(0, 8)}</span>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500 mr-2">Placed on:</span>
                      <span>{formatDate(order.createdAt)}</span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <div className="mb-4">
                      <h3 className="font-medium mb-2">Items</h3>
                      <div className="space-y-3">
                        {order.items.map(item => (
                          <div key={item.id} className="flex items-center">
                            <div className="w-12 h-12 rounded-md overflow-hidden flex-shrink-0">
                              <img 
                                src={item.image} 
                                alt={item.recipeName} 
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="ml-3 flex-grow">
                              <p className="font-medium">{item.recipeName}</p>
                              <p className="text-sm text-gray-500">
                                {item.type === 'ingredients' ? 'Ingredients Only' : 'Ready-made Food'}
                              </p>
                            </div>
                            <div className="text-sm">
                              <p>{item.quantity} x ₹{item.price}</p>
                              <p className="font-medium">₹{item.quantity * item.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center border-t border-gray-200 pt-3">
                      <div>
                        <p className="text-sm text-gray-500">Delivery Address:</p>
                        <p className="text-sm">{order.address}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Total Amount:</p>
                        <p className="font-bold text-lg">₹{order.totalAmount.toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default OrdersPage;
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, X, Clock, Package, Truck, FileCheck, Eye, Filter } from 'lucide-react';
import { Order, OrderStatus } from '../../store/orderStore';

interface OrdersListProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => Promise<boolean>;
}

const OrdersList: React.FC<OrdersListProps> = ({ orders, onUpdateStatus }) => {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  const toggleOrderDetails = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    setIsUpdating(orderId);
    
    try {
      await onUpdateStatus(orderId, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(null);
    }
  };
  
  const getStatusIcon = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <Clock size={18} className="text-warning" />;
      case 'confirmed':
        return <Check size={18} className="text-success" />;
      case 'processing':
        return <Package size={18} className="text-primary" />;
      case 'completed':
        return <FileCheck size={18} className="text-success" />;
      case 'rejected':
        return <X size={18} className="text-error" />;
      default:
        return <Clock size={18} className="text-warning" />;
    }
  };
  
  const getStatusColor = (status: OrderStatus) => {
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
  
  // Filter orders based on status
  const filteredOrders = statusFilter === 'all' 
    ? orders 
    : orders.filter(order => order.status === statusFilter);
  
  if (orders.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No orders found.</p>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        <h3 className="heading-3">Orders</h3>
        
        <div className="flex items-center">
          <Filter size={16} className="text-gray-500 mr-2" />
          <select 
            className="border border-gray-300 rounded-md px-2 py-1 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          >
            <option value="all">All Orders</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="completed">Completed</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredOrders.map(order => (
              <React.Fragment key={order.id}>
                <tr className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{order.id.slice(0, 8)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    ₹{order.totalAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-1 capitalize">{order.status}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleOrderDetails(order.id)}
                        className="text-primary hover:text-primary-dark"
                      >
                        <Eye size={18} />
                      </button>
                      
                      {order.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'confirmed')}
                            className="text-success hover:text-green-600"
                            disabled={isUpdating === order.id}
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(order.id, 'rejected')}
                            className="text-error hover:text-red-600"
                            disabled={isUpdating === order.id}
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'processing')}
                          className="text-primary hover:text-primary-dark"
                          disabled={isUpdating === order.id}
                        >
                          <Truck size={18} />
                        </button>
                      )}
                      
                      {order.status === 'processing' && (
                        <button
                          onClick={() => handleUpdateStatus(order.id, 'completed')}
                          className="text-success hover:text-green-600"
                          disabled={isUpdating === order.id}
                        >
                          <FileCheck size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
                
                {/* Order Details Expansion */}
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <motion.tr
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <td colSpan={5} className="px-6 py-4">
                        <div className="bg-gray-50 p-4 rounded-md">
                          <h4 className="font-medium mb-2">Order Details</h4>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-gray-500">Delivery Address:</p>
                              <p className="text-sm">{order.address}</p>
                            </div>
                            <div>
                              <p className="text-sm text-gray-500">Contact Number:</p>
                              <p className="text-sm">{order.contactNumber}</p>
                            </div>
                          </div>
                          
                          <h5 className="font-medium mb-2">Items:</h5>
                          <div className="space-y-2">
                            {order.items.map(item => (
                              <div key={item.id} className="flex justify-between items-center text-sm">
                                <span>
                                  {item.quantity}x {item.recipeName} 
                                  <span className="text-gray-500 ml-1">
                                    ({item.type === 'ingredients' ? 'Ingredients' : 'Ready Food'})
                                  </span>
                                </span>
                                <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </td>
                    </motion.tr>
                  )}
                </AnimatePresence>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OrdersList;
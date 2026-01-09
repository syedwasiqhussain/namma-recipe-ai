import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';
import OrdersList from '../components/admin/OrdersList';
import RevenueStats from '../components/admin/RevenueStats';
import { useOrderStore, Order, OrderStatus } from '../store/orderStore';

const AdminDashboard: React.FC = () => {
  const { fetchAllOrders, updateOrderStatus, getRevenueStats, isLoading } = useOrderStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [revenueData, setRevenueData] = useState({
    total: 0,
    confirmed: 0,
    rejected: 0
  });
  
  useEffect(() => {
    const loadOrders = async () => {
      const allOrders = await fetchAllOrders();
      setOrders(allOrders);
    };
    
    loadOrders();
    setRevenueData(getRevenueStats());
  }, [fetchAllOrders, getRevenueStats]);
  
  const handleUpdateStatus = async (orderId: string, status: OrderStatus) => {
    const success = await updateOrderStatus(orderId, status);
    
    if (success) {
      // Refresh orders
      const updatedOrders = await fetchAllOrders();
      setOrders(updatedOrders);
      // Update revenue stats
      setRevenueData(getRevenueStats());
    }
    
    return success;
  };
  
  if (isLoading && orders.length === 0) {
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
          <div className="mb-8">
            <h1 className="heading-1 flex items-center mb-2">
              <ShieldCheck size={32} className="mr-2 text-primary" />
              Admin Dashboard
            </h1>
            <p className="text-gray-600">
              Manage orders, track revenue, and keep an eye on your business performance.
            </p>
          </div>
          
          <div className="mb-12">
            <RevenueStats 
              total={revenueData.total}
              confirmed={revenueData.confirmed}
              rejected={revenueData.rejected}
            />
          </div>
          
          <div>
            <OrdersList 
              orders={orders}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
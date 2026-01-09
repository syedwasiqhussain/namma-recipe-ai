import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, Percent } from 'lucide-react';

interface RevenueStatsProps {
  total: number;
  confirmed: number;
  rejected: number;
}

const RevenueStats: React.FC<RevenueStatsProps> = ({ total, confirmed, rejected }) => {
  // Calculate conversion rate
  const conversionRate = total > 0 ? (confirmed / total) * 100 : 0;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Total Revenue</h3>
          <div className="p-2 bg-primary/10 rounded-full">
            <DollarSign size={20} className="text-primary" />
          </div>
        </div>
        
        <p className="text-3xl font-bold mb-2">₹{total.toFixed(2)}</p>
        
        <div className="flex items-center text-xs text-gray-500">
          <span>All orders (including pending)</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Confirmed Revenue</h3>
          <div className="p-2 bg-success/10 rounded-full">
            <TrendingUp size={20} className="text-success" />
          </div>
        </div>
        
        <p className="text-3xl font-bold mb-2">₹{confirmed.toFixed(2)}</p>
        
        <div className="flex items-center text-xs text-success">
          <span>Confirmed, processing, and completed orders</span>
        </div>
      </motion.div>
      
      <motion.div 
        className="bg-white rounded-lg shadow-md p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">Conversion Rate</h3>
          <div className="p-2 bg-secondary/10 rounded-full">
            <Percent size={20} className="text-secondary" />
          </div>
        </div>
        
        <p className="text-3xl font-bold mb-2">{conversionRate.toFixed(1)}%</p>
        
        <div className="flex items-center text-xs text-gray-500">
          <span>Confirmed vs Total Orders</span>
        </div>
      </motion.div>
    </div>
  );
};

export default RevenueStats;
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from 'framer-motion';

// Pages
import HomePage from './pages/HomePage';
import RecipeGenerator from './pages/RecipeGenerator';
import RecipeDetails from './pages/RecipeDetails';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/AdminDashboard';
import NotFoundPage from './pages/NotFoundPage';
import OrdersPage from './pages/OrdersPage';

// Components
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import AdminRoute from './components/auth/AdminRoute';
import DoorAnimation from './components/animations/DoorAnimation';

// Store
import { useAuthStore } from './store/authStore';

function App() {
  const { checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <Router>
      <DoorAnimation>
        <AnimatePresence mode="wait">
          <Layout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/generator" element={<RecipeGenerator />} />
              <Route path="/recipe/:id" element={<RecipeDetails />} />
              <Route path="/cart" element={
                <ProtectedRoute>
                  <CartPage />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrdersPage />
                </ProtectedRoute>
              } />
              <Route path="/admin" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </Layout>
        </AnimatePresence>
        <ToastContainer position="bottom-right" />
      </DoorAnimation>
    </Router>
  );
}

export default App;
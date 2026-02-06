import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';
import LandingPage from './components/rms/LandingPage';
import RestaurantAuth from './components/rms/restaurant/RestaurantAuth';
import RestaurantDashboard from './components/rms/restaurant/RestaurantDashboard';
import CustomerAuth from './components/rms/customer/CustomerAuth';
import CustomerDashboard from './components/rms/customer/CustomerDashboard';
import RestaurantMenu from './components/rms/customer/RestaurantMenu';

// Placeholder context or state management could go here or in a separate file
// For this prototype, we'll rely on local state and simulating "persistence" via a simple mock service if Supabase isn't connected yet.

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          
          {/* Restaurant Routes */}
          <Route path="/restaurant/auth" element={<RestaurantAuth />} />
          <Route path="/restaurant/dashboard" element={<RestaurantDashboard />} />
          
          {/* Customer Routes */}
          <Route path="/customer/auth" element={<CustomerAuth />} />
          <Route path="/customer/dashboard" element={<CustomerDashboard />} />
          <Route path="/menu/:restaurantId" element={<RestaurantMenu />} />
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Toaster position="top-center" richColors />
      </div>
    </BrowserRouter>
  );
}

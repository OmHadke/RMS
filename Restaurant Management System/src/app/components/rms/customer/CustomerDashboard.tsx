import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QrCode, Search, MapPin, Star, Clock, LogOut, Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../../../services/storage';

const FALLBACK_IMAGES = [
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=600',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=600'
];

export default function CustomerDashboard() {
  const navigate = useNavigate();
  const restaurants = useMemo(() => storage.getRestaurants(), []);

  return (
    <div className="min-h-screen bg-neutral-50 pb-20">
      {/* Header */}
      <header className="bg-white sticky top-0 z-20 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              JD
            </div>
            <div>
              <p className="text-xs text-neutral-500">Delivering to</p>
              <div className="flex items-center gap-1 text-sm font-bold text-neutral-900">
                Current Location <MapPin size={14} className="text-blue-600" />
              </div>
            </div>
          </div>
          <button onClick={() => { storage.setCustomerSession(null); navigate('/'); }} className="text-neutral-400 hover:text-neutral-600">
            <LogOut size={20} />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="px-4 pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <input 
              type="text" 
              placeholder="Search for restaurants, cuisines..." 
              className="w-full pl-10 pr-4 py-3 bg-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 pt-6">
        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <button className="bg-blue-600 text-white p-4 rounded-2xl shadow-lg shadow-blue-200 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <QrCode size={32} />
            <span className="font-semibold">Scan QR Menu</span>
          </button>
          <button className="bg-purple-600 text-white p-4 rounded-2xl shadow-lg shadow-purple-200 flex flex-col items-center justify-center gap-2 active:scale-95 transition-transform">
            <Camera size={32} />
            <span className="font-semibold">AI Food Scan</span>
          </button>
        </div>

        {/* Nearby Map Button */}
        <div className="mb-8">
           <button className="w-full bg-white text-neutral-800 p-4 rounded-2xl shadow-sm border border-neutral-100 flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-neutral-50">
            <MapPin size={24} className="text-orange-500" />
            <span className="font-semibold">Find Nearby Restaurants</span>
          </button>
        </div>

        {/* Featured Section */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-neutral-900">Featured Restaurants</h2>
          <button
            onClick={() => navigate('/restaurant/auth')}
            className="text-xs font-semibold text-blue-600 hover:text-blue-500"
          >
            Register a Restaurant
          </button>
        </div>
        <div className="space-y-4">
          {restaurants.length === 0 ? (
            <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
              No restaurants yet. Register a restaurant to generate a QR menu.
            </div>
          ) : (
            restaurants.map((restaurant, index) => (
              <motion.div
                key={restaurant.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/menu/${restaurant.id}`)}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-neutral-100 cursor-pointer active:scale-[0.98] transition-transform"
              >
                <div className="h-40 relative">
                  <img
                    src={FALLBACK_IMAGES[index % FALLBACK_IMAGES.length]}
                    alt={restaurant.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1">
                    <Clock size={12} /> 20-30 min
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-1">
                    <h3 className="text-lg font-bold text-neutral-900">{restaurant.name}</h3>
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-1.5 py-0.5 rounded text-xs font-bold">
                      <Star size={12} fill="currentColor" /> 4.8
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-neutral-500 gap-2">
                    <span>{restaurant.address}</span>
                    <span>•</span>
                    <span>{restaurant.openingHours}</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

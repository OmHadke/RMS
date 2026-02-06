import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UtensilsCrossed, User } from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-neutral-900 text-white">
      {/* Background Image with Overlay */}
      <div 
        className="absolute inset-0 z-0 opacity-40 bg-cover bg-center"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1613274554329-70f997f5789f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")' }}
      />
      <div className="absolute inset-0 z-0 bg-black/60" />

      <div className="relative z-10 container mx-auto px-4 py-16 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            Restaurant Management System
          </h1>
          <p className="text-xl md:text-2xl text-neutral-300 max-w-2xl mx-auto mb-12">
            Seamlessly bridge the gap between culinary excellence and customer satisfaction.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Restaurant Owner Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            onClick={() => navigate('/restaurant/auth')}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-orange-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <UtensilsCrossed size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Restaurant Partner</h2>
              <p className="text-neutral-300 mb-6">
                Register your restaurant, manage your menu, and gain insights.
              </p>
              <button className="px-6 py-2 bg-white text-neutral-900 font-semibold rounded-full hover:bg-orange-100 transition-colors">
                Manage Restaurant
              </button>
            </div>
          </motion.div>

          {/* Customer Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="group relative bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all cursor-pointer"
            onClick={() => navigate('/customer/auth')}
          >
            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative z-10 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                <User size={40} className="text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-3">Diner</h2>
              <p className="text-neutral-300 mb-6">
                Discover menus, book tables, and enjoy a seamless dining experience.
              </p>
              <button className="px-6 py-2 bg-white text-neutral-900 font-semibold rounded-full hover:bg-blue-100 transition-colors">
                Explore Menus
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

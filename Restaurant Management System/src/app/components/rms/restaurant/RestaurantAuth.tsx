import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(isLogin ? "Welcome back!" : "Restaurant registered successfully!");
      // In a real app, we'd store the token here
      navigate('/restaurant/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1746494557939-2d305c1c834a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Manage Your Culinary Business</h2>
          <p className="text-lg opacity-90">Join thousands of restaurants optimizing their operations with RMS.</p>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {isLogin ? 'Restaurant Login' : 'Register Restaurant'}
            </h1>
            <p className="text-neutral-500">
              {isLogin ? 'Enter your credentials to access your dashboard' : 'Create an account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Restaurant Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Store className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                    placeholder="e.g. The Golden Spoon"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="name@restaurant.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5" />
              ) : (
                <>
                  {isLogin ? 'Sign In' : 'Create Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm font-medium text-orange-600 hover:text-orange-500 transition-colors"
            >
              {isLogin ? "Don't have an account? Register now" : "Already have an account? Sign in"}
            </button>
          </div>
          
          <div className="mt-8 text-center">
             <button onClick={() => navigate('/')} className="text-sm text-neutral-400 hover:text-neutral-600">Back to Home</button>
          </div>
        </div>
      </div>
    </div>
  );
}

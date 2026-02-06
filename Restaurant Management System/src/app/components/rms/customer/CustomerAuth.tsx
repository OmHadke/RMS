import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ArrowRight, Loader2, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function CustomerAuth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
      // Navigate to dashboard
      navigate('/customer/dashboard');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {/* Right Side - Image (flipped order for variety) */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 order-2 lg:order-1">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-neutral-900 mb-2">
              {isLogin ? 'Customer Login' : 'Create Account'}
            </h1>
            <p className="text-neutral-500">
              {isLogin ? 'Sign in to access your favorite menus and bookings' : 'Join to explore the best dining experiences'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="text"
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
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
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1">Phone Number</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-neutral-400" />
                  </div>
                  <input
                    type="tel"
                    required={!isLogin}
                    className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-neutral-400" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
              className="text-sm font-medium text-blue-600 hover:text-blue-500 transition-colors"
            >
              {isLogin ? "New user? Create an account" : "Have an account? Sign in"}
            </button>
          </div>

          <div className="mt-8 text-center">
             <button onClick={() => navigate('/')} className="text-sm text-neutral-400 hover:text-neutral-600">Back to Home</button>
          </div>
        </div>
      </div>

      {/* Left Side - Image */}
      <div className="hidden lg:block w-1/2 relative order-1 lg:order-2">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080")' }}
        />
        <div className="absolute inset-0 bg-black/40" />
        <div className="absolute bottom-0 left-0 p-12 text-white">
          <h2 className="text-4xl font-bold mb-4">Discover Amazing Food</h2>
          <p className="text-lg opacity-90">Explore menus, find new favorites, and enjoy seamless dining.</p>
        </div>
      </div>
    </div>
  );
}

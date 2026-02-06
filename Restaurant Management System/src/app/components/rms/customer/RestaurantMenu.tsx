import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Plus, Minus, Info, Flame, Star, Calendar, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { storage, MenuItem, RecommendationTag } from '../../../services/storage';

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];
const TAG_COLORS: Record<RecommendationTag, string> = {
  diabetic: 'bg-emerald-100 text-emerald-700',
  fitness: 'bg-blue-100 text-blue-700',
  kids: 'bg-yellow-100 text-yellow-700',
  vegan: 'bg-purple-100 text-purple-700'
};

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<{id: string, qty: number}[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({ date: '', time: '', partySize: 2 });
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });

  const restaurant = useMemo(() => {
    if (!restaurantId) {
      return null;
    }
    return storage.getRestaurantById(restaurantId);
  }, [restaurantId]);

  const menuItems = useMemo(() => {
    if (!restaurantId) {
      return [];
    }
    return storage.getMenuItems(restaurantId);
  }, [restaurantId]);

  const addToCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { id, qty: 1 }];
    });
    toast.success('Added to cart');
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === id);
      if (existing && existing.qty > 1) {
        return prev.map(item => item.id === id ? { ...item, qty: item.qty - 1 } : item);
      }
      return prev.filter(item => item.id !== id);
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, cartItem) => {
      const item = menuItems.find(i => i.id === cartItem.id);
      return total + (item ? item.price * cartItem.qty : 0);
    }, 0);
  };

  const getCartCount = () => cart.reduce((acc, item) => acc + item.qty, 0);

  const filteredItems = activeCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory);

  const handlePlaceOrder = () => {
    if (!restaurantId) {
      toast.error('Missing restaurant information.');
      return;
    }
    if (cart.length === 0) {
      toast.error('Your cart is empty.');
      return;
    }
    const sessions = storage.getSessions();
    storage.addOrder({
      restaurantId,
      customerId: sessions.customerId,
      items: cart.map(item => ({ menuItemId: item.id, quantity: item.qty })),
      total: getCartTotal(),
      paymentMethod: 'cod'
    });
    setCart([]);
    setIsCartOpen(false);
    toast.success('Order placed successfully!');
  };

  const handleBookingSubmit = () => {
    if (!restaurantId) {
      toast.error('Missing restaurant information.');
      return;
    }
    if (!bookingData.date || !bookingData.time) {
      toast.error('Please select a date and time.');
      return;
    }
    const sessions = storage.getSessions();
    storage.addBooking({
      restaurantId,
      customerId: sessions.customerId,
      date: bookingData.date,
      time: bookingData.time,
      partySize: bookingData.partySize
    });
    setIsBookingOpen(false);
    toast.success('Table booked successfully!');
  };

  const handleReviewSubmit = () => {
    if (!restaurantId) {
      toast.error('Missing restaurant information.');
      return;
    }
    if (!reviewData.comment.trim()) {
      toast.error('Please add a comment.');
      return;
    }
    const sessions = storage.getSessions();
    storage.addReview({
      restaurantId,
      customerId: sessions.customerId,
      rating: reviewData.rating,
      comment: reviewData.comment
    });
    setReviewData({ rating: 5, comment: '' });
    toast.success('Thanks for your review!');
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Restaurant not found</h2>
          <p className="text-sm text-neutral-500 mb-6">Please scan a valid QR code or select a restaurant.</p>
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="px-4 py-2 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 pb-24">
      {/* Header Image */}
      <div className="relative h-64 bg-neutral-900">
        <img 
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1080" 
          alt="Restaurant Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-start text-white">
          <button onClick={() => navigate(-1)} className="bg-black/30 backdrop-blur-md p-2 rounded-full hover:bg-black/50 transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div className="bg-black/30 backdrop-blur-md p-2 rounded-full hover:bg-black/50 transition-colors cursor-pointer relative">
            <ShoppingBag size={24} />
            {getCartCount() > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {getCartCount()}
              </span>
            )}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent pt-20">
          <h1 className="text-3xl font-bold text-white mb-1">{restaurant.name}</h1>
          <p className="text-neutral-300 text-sm mb-2">{restaurant.address} • {restaurant.openingHours}</p>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded inline-flex text-white">
             <Star size={12} fill="currentColor" className="text-yellow-400" /> 4.8 (120+ ratings)
          </div>
          <button
            onClick={() => setIsBookingOpen(true)}
            className="ml-4 px-3 py-1 bg-white text-neutral-900 text-xs font-bold rounded-full hover:bg-neutral-100 transition-colors"
          >
            Book a Table
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="sticky top-0 z-10 bg-white border-b border-neutral-200 shadow-sm overflow-x-auto no-scrollbar">
        <div className="flex px-4 py-3 gap-3 min-w-max">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                activeCategory === cat 
                  ? 'bg-neutral-900 text-white' 
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-neutral-200 p-6 text-center text-sm text-neutral-500">
            No menu items available yet.
          </div>
        ) : (
          filteredItems.map(item => (
            <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex gap-4" onClick={() => setSelectedItem(item)}>
              <div className="w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-neutral-900 line-clamp-1">{item.name}</h3>
                  <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
                  {!item.available && (
                    <span className="inline-block mt-2 text-[10px] uppercase tracking-wide font-semibold text-red-500">
                      Unavailable
                    </span>
                  )}
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-neutral-900">${item.price.toFixed(2)}</span>
                  <button 
                    onClick={(e) => { e.stopPropagation(); addToCart(item.id); }}
                    disabled={!item.available}
                    className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors disabled:bg-neutral-300 disabled:cursor-not-allowed"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Cart Summary Bar */}
      <AnimatePresence>
        {cart.length > 0 && (
          <motion.div 
            key="cart-bar"
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-4 left-4 right-4 z-20"
          >
            <div className="bg-neutral-900 text-white p-4 rounded-2xl shadow-xl flex justify-between items-center cursor-pointer hover:bg-neutral-800 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center font-bold">
                  {getCartCount()}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400">Total</span>
                  <span className="font-bold">${getCartTotal().toFixed(2)}</span>
                </div>
              </div>
              <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 font-bold text-sm">
                View Cart <ChevronLeft size={16} className="rotate-180" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Item Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <motion.div 
            key="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setSelectedItem(null)}
          >
            <motion.div 
              key="modal-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="h-64 relative">
                <img src={selectedItem.image} alt={selectedItem.name} className="w-full h-full object-cover" />
                <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white">
                  <Plus size={24} className="rotate-45" />
                </button>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-2xl font-bold text-neutral-900">{selectedItem.name}</h2>
                  <span className="text-xl font-bold text-neutral-900">${selectedItem.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-neutral-500 mb-6">
                   <span className="flex items-center gap-1"><Flame size={16} className="text-orange-500" /> {selectedItem.calories} kcal</span>
                   <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                   <span className="flex items-center gap-1"><Info size={16} className="text-blue-500" /> Info</span>
                </div>
                <p className="text-neutral-600 mb-8 leading-relaxed">{selectedItem.description}</p>
                <div className="mb-6 space-y-3 text-sm text-neutral-600">
                  <div>
                    <p className="font-semibold text-neutral-800">Ingredients</p>
                    <p>{selectedItem.ingredients.join(', ') || 'Not specified'}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-800">Cooking Methodology</p>
                    <p>{selectedItem.cookingMethod || 'Not specified'}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedItem.recommendedFor.map(tag => (
                      <span key={tag} className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${TAG_COLORS[tag]}`}>
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button 
                  onClick={() => { addToCart(selectedItem.id); setSelectedItem(null); }}
                  className="w-full py-4 bg-orange-600 text-white rounded-xl font-bold text-lg hover:bg-orange-700 transition-colors shadow-lg shadow-orange-200"
                >
                  Add to Order - ${selectedItem.price.toFixed(2)}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart Modal */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            key="cart-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              key="cart-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Your Cart</h2>
                <button onClick={() => setIsCartOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                {cart.map(cartItem => {
                  const item = menuItems.find(i => i.id === cartItem.id);
                  if (!item) {
                    return null;
                  }
                  return (
                    <div key={cartItem.id} className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-neutral-900">{item.name}</p>
                        <p className="text-xs text-neutral-500">${item.price.toFixed(2)} each</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button onClick={() => removeFromCart(item.id)} className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center">
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-semibold">{cartItem.qty}</span>
                        <button onClick={() => addToCart(item.id)} className="w-7 h-7 rounded-full border border-neutral-200 flex items-center justify-center">
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="p-6 border-t border-neutral-200 space-y-4">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>${getCartTotal().toFixed(2)}</span>
                </div>
                <div className="text-xs text-neutral-500">Payment: Cash on delivery / Pay at restaurant</div>
                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-3 bg-neutral-900 text-white rounded-xl font-bold hover:bg-neutral-800 transition-colors"
                >
                  Place Order
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Booking Modal */}
      <AnimatePresence>
        {isBookingOpen && (
          <motion.div
            key="booking-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center"
            onClick={() => setIsBookingOpen(false)}
          >
            <motion.div
              key="booking-content"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
              onClick={e => e.stopPropagation()}
            >
              <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-neutral-900">Book a Table</h2>
                <button onClick={() => setIsBookingOpen(false)} className="text-neutral-400 hover:text-neutral-600">
                  ✕
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="date"
                      value={bookingData.date}
                      onChange={(event) => setBookingData({ ...bookingData, date: event.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Time</label>
                  <input
                    type="time"
                    value={bookingData.time}
                    onChange={(event) => setBookingData({ ...bookingData, time: event.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Party Size</label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      type="number"
                      min={1}
                      value={bookingData.partySize}
                      onChange={(event) => setBookingData({ ...bookingData, partySize: Number(event.target.value) })}
                      className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>
                <button
                  onClick={handleBookingSubmit}
                  className="w-full py-3 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Section */}
      <div className="bg-white border-t border-neutral-200 p-6 mt-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Leave a Review</h2>
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm text-neutral-600">Rating</label>
            <select
              value={reviewData.rating}
              onChange={(event) => setReviewData({ ...reviewData, rating: Number(event.target.value) })}
              className="border border-neutral-300 rounded-lg px-3 py-2 text-sm"
            >
              {[5, 4, 3, 2, 1].map(value => (
                <option key={value} value={value}>{value} Stars</option>
              ))}
            </select>
          </div>
          <textarea
            value={reviewData.comment}
            onChange={(event) => setReviewData({ ...reviewData, comment: event.target.value })}
            className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            rows={3}
            placeholder="Share your experience..."
          />
          <button
            onClick={handleReviewSubmit}
            className="mt-4 px-4 py-2 bg-neutral-900 text-white rounded-lg font-semibold hover:bg-neutral-800 transition-colors"
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

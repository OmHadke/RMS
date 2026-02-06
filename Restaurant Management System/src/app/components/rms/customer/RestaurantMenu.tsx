import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ShoppingBag, Plus, Minus, Info, Flame, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

// Mock Data (duplicated for demo consistency, in real app would come from same source)
const MENU_ITEMS = [
  {
    id: '1',
    name: 'Truffle Mushroom Burger',
    description: 'Angus beef patty with truffle mayo, swiss cheese, and caramelized onions.',
    price: 18.50,
    calories: 850,
    image: 'https://images.unsplash.com/photo-1717158776685-d4b7c346e1a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
    category: 'Main Course'
  },
  {
    id: '2',
    name: 'Caesar Salad',
    description: 'Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing.',
    price: 12.00,
    calories: 450,
    image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=600',
    category: 'Starters'
  },
  {
    id: '3',
    name: 'Margherita Pizza',
    description: 'Classic tomato sauce, fresh mozzarella, basil, and extra virgin olive oil.',
    price: 15.00,
    calories: 700,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600',
    category: 'Main Course'
  }
];

const CATEGORIES = ['All', 'Starters', 'Main Course', 'Desserts', 'Beverages'];

export default function RestaurantMenu() {
  const navigate = useNavigate();
  const { restaurantId } = useParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<{id: string, qty: number}[]>([]);
  const [selectedItem, setSelectedItem] = useState<typeof MENU_ITEMS[0] | null>(null);

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
      const item = MENU_ITEMS.find(i => i.id === cartItem.id);
      return total + (item ? item.price * cartItem.qty : 0);
    }, 0);
  };

  const getCartCount = () => cart.reduce((acc, item) => acc + item.qty, 0);

  const filteredItems = activeCategory === 'All' 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

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
          <h1 className="text-3xl font-bold text-white mb-1">The Golden Spoon</h1>
          <p className="text-neutral-300 text-sm mb-2">Modern American • 0.5 mi</p>
          <div className="flex items-center gap-2 text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded inline-flex text-white">
             <Star size={12} fill="currentColor" className="text-yellow-400" /> 4.8 (120+ ratings)
          </div>
          <button className="ml-4 px-3 py-1 bg-white text-neutral-900 text-xs font-bold rounded-full hover:bg-neutral-100 transition-colors">
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
        {filteredItems.map(item => (
          <div key={item.id} className="bg-white p-3 rounded-2xl shadow-sm border border-neutral-100 flex gap-4" onClick={() => setSelectedItem(item)}>
            <div className="w-24 h-24 bg-neutral-100 rounded-xl overflow-hidden shrink-0">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-neutral-900 line-clamp-1">{item.name}</h3>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-1">{item.description}</p>
              </div>
              <div className="flex justify-between items-end mt-2">
                <span className="font-bold text-neutral-900">${item.price.toFixed(2)}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); addToCart(item.id); }}
                  className="w-8 h-8 bg-neutral-900 text-white rounded-full flex items-center justify-center hover:bg-neutral-800 transition-colors"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
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
              <button className="flex items-center gap-2 font-bold text-sm">
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
    </div>
  );
}

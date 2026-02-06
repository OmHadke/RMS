import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import { Plus, Search, Trash2, Edit2, LogOut, Utensils, QrCode as QrIcon, Image, Leaf, ToggleLeft, ToggleRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { storage, MenuItem, RestaurantProfile, RecommendationTag } from '../../../services/storage';

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=400';
const RECOMMENDATION_TAGS: RecommendationTag[] = ['diabetic', 'fitness', 'kids', 'vegan'];

export default function RestaurantDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'menu' | 'qr'>('menu');
  const restaurantSession = storage.getSessions().restaurantId;
  const restaurant = useMemo<RestaurantProfile | null>(() => {
    if (!restaurantSession) {
      return null;
    }
    return storage.getRestaurantById(restaurantSession);
  }, [restaurantSession]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>(
    restaurant ? storage.getMenuItems(restaurant.id) : []
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<Partial<MenuItem>>({
    name: '',
    description: '',
    price: 0,
    calories: 0,
    category: 'Main Course',
    image: DEFAULT_IMAGE,
    ingredients: [],
    cookingMethod: '',
    recommendedFor: [],
    available: true
  });

  const handleOpenModal = (item?: MenuItem) => {
    if (item) {
      setEditingItem(item);
      setFormData(item);
    } else {
      setEditingItem(null);
      setFormData({
        name: '',
        description: '',
        price: 0,
        calories: 0,
        category: 'Main Course',
        image: DEFAULT_IMAGE,
        ingredients: [],
        cookingMethod: '',
        recommendedFor: [],
        available: true
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!restaurant) {
      toast.error('Please log in as a restaurant first.');
      navigate('/restaurant/auth');
      return;
    }
    if (editingItem) {
      const updatedItem = { ...editingItem, ...formData } as MenuItem;
      storage.updateMenuItem(updatedItem);
      setMenuItems(menuItems.map(item => item.id === editingItem.id ? updatedItem : item));
      toast.success('Item updated successfully');
    } else {
      const newItem = storage.addMenuItem(restaurant.id, formData as Omit<MenuItem, 'id' | 'restaurantId'>);
      setMenuItems([...menuItems, newItem]);
      toast.success('Item added successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      storage.deleteMenuItem(id);
      setMenuItems(menuItems.filter(item => item.id !== id));
      toast.success('Item deleted');
    }
  };

  const handleLogout = () => {
    storage.setRestaurantSession(null);
    navigate('/');
  };

  const handleRecommendationToggle = (tag: RecommendationTag) => {
    const current = formData.recommendedFor ?? [];
    if (current.includes(tag)) {
      setFormData({ ...formData, recommendedFor: current.filter(item => item !== tag) });
      return;
    }
    setFormData({ ...formData, recommendedFor: [...current, tag] });
  };

  if (!restaurant) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50">
        <div className="bg-white border border-neutral-200 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="text-xl font-bold text-neutral-900 mb-2">Restaurant session required</h2>
          <p className="text-sm text-neutral-500 mb-6">Please log in or register your restaurant to manage menu items.</p>
          <button
            onClick={() => navigate('/restaurant/auth')}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg font-medium hover:bg-orange-700 transition-colors"
          >
            Go to Restaurant Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-orange-600 rounded-lg flex items-center justify-center text-white">
            <Utensils size={24} />
          </div>
          <h1 className="text-xl font-bold text-neutral-900">{restaurant.name} <span className="text-sm font-normal text-neutral-500 ml-2">Dashboard</span></h1>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => setActiveTab('menu')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'menu' ? 'bg-orange-100 text-orange-700' : 'text-neutral-600 hover:bg-neutral-50'}`}>
            Menu Management
          </button>
          <button onClick={() => setActiveTab('qr')} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === 'qr' ? 'bg-orange-100 text-orange-700' : 'text-neutral-600 hover:bg-neutral-50'}`}>
            QR Code
          </button>
          <div className="h-6 w-px bg-neutral-200 mx-2" />
          <button onClick={handleLogout} className="text-neutral-500 hover:text-red-600 transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-6 max-w-6xl">
        {activeTab === 'menu' ? (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-neutral-800">Menu Items</h2>
              <button 
                onClick={() => handleOpenModal()}
                className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors shadow-sm"
              >
                <Plus size={20} /> Add New Item
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map(item => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow group">
                  <div className="h-48 overflow-hidden relative">
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold text-neutral-700">
                      {item.calories} kcal
                    </div>
                    {!item.available && (
                      <div className="absolute bottom-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Unavailable
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <span className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{item.category}</span>
                        <h3 className="text-lg font-bold text-neutral-900">{item.name}</h3>
                      </div>
                      <span className="text-lg font-bold text-neutral-900">${item.price.toFixed(2)}</span>
                    </div>
                    <p className="text-neutral-500 text-sm mb-4 line-clamp-2">{item.description}</p>
                    <div className="flex flex-wrap gap-2 text-[11px] text-neutral-500 mb-4">
                      {item.recommendedFor?.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-neutral-100 rounded-full uppercase tracking-wide">
                          {tag}
                        </span>
                      ))}
                    </div>
                    
                    <div className="flex justify-end gap-2 pt-2 border-t border-neutral-100">
                      <button onClick={() => handleOpenModal(item)} className="p-2 text-neutral-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }} className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="bg-white p-8 rounded-2xl shadow-lg border border-neutral-200 text-center max-w-md w-full">
              <div className="mb-6 flex justify-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 mb-4">
                  <QrIcon size={32} />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 mb-2">Your Digital Menu QR Code</h2>
              <p className="text-neutral-500 mb-8">Print this QR code and place it on your tables. Customers can scan it to view your menu and order.</p>
              
              <div className="bg-white p-4 border border-neutral-200 rounded-xl inline-block shadow-inner mb-8">
                <QRCode value={`${window.location.origin}/menu/${restaurant.id}`} size={200} />
              </div>

              <button className="w-full py-3 bg-neutral-900 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
                Download PDF
              </button>
            </div>
          </motion.div>
        )}
      </main>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              key="modal"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-neutral-50">
                <h3 className="text-lg font-bold text-neutral-900">{editingItem ? 'Edit Item' : 'Add New Item'}</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-neutral-600">✕</button>
              </div>
              <form onSubmit={handleSave} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Item Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Description</label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-24"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Image URL</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Image className="h-5 w-5 text-neutral-400" />
                    </div>
                    <input
                      type="url"
                      required
                      value={formData.image}
                      onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full pl-10 pr-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Calories (kcal)</label>
                    <input
                      type="number"
                      required
                      value={formData.calories}
                      onChange={e => setFormData({...formData, calories: parseInt(e.target.value)})}
                      className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Ingredients</label>
                  <input
                    type="text"
                    value={(formData.ingredients ?? []).join(', ')}
                    onChange={(event) =>
                      setFormData({
                        ...formData,
                        ingredients: event.target.value
                          .split(',')
                          .map(item => item.trim())
                          .filter(Boolean)
                      })
                    }
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                    placeholder="Beef, Truffle Oil, Swiss Cheese"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Cooking Methodology</label>
                  <textarea
                    value={formData.cookingMethod ?? ''}
                    onChange={e => setFormData({ ...formData, cookingMethod: e.target.value })}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none h-20"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Category</label>
                  <select 
                    value={formData.category}
                    onChange={e => setFormData({...formData, category: e.target.value})}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
                  >
                    <option>Starters</option>
                    <option>Main Course</option>
                    <option>Desserts</option>
                    <option>Beverages</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-2">Recommended for</label>
                  <div className="flex flex-wrap gap-2">
                    {RECOMMENDATION_TAGS.map((tag) => (
                      <button
                        type="button"
                        key={tag}
                        onClick={() => handleRecommendationToggle(tag)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide transition-colors ${
                          formData.recommendedFor?.includes(tag)
                            ? 'bg-orange-100 text-orange-700'
                            : 'bg-neutral-100 text-neutral-500'
                        }`}
                      >
                        <Leaf size={12} className="inline-block mr-1" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-neutral-200 px-4 py-3">
                  <div>
                    <p className="text-sm font-medium text-neutral-800">Availability</p>
                    <p className="text-xs text-neutral-500">Mark whether this dish is currently available.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, available: !formData.available })}
                    className="text-orange-600"
                  >
                    {formData.available ? <ToggleRight size={28} /> : <ToggleLeft size={28} />}
                  </button>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-neutral-600 font-medium hover:bg-neutral-100 rounded-lg transition-colors">
                    Cancel
                  </button>
                  <button type="submit" className="px-4 py-2 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors shadow-sm">
                    Save Item
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

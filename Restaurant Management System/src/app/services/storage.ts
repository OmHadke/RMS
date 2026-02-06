export type RecommendationTag = 'diabetic' | 'fitness' | 'kids' | 'vegan';

export interface RestaurantProfile {
  id: string;
  name: string;
  address: string;
  contact: string;
  openingHours: string;
  email: string;
  password: string;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  image: string;
  ingredients: string[];
  cookingMethod: string;
  calories: number;
  category: string;
  recommendedFor: RecommendationTag[];
  price: number;
  available: boolean;
}

export interface CustomerProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  preference: string;
  allergies: string;
  password: string;
  createdAt: string;
}

export interface OrderItem {
  menuItemId: string;
  quantity: number;
}

export interface OrderRecord {
  id: string;
  restaurantId: string;
  customerId: string | null;
  items: OrderItem[];
  total: number;
  paymentMethod: 'cod';
  status: 'placed' | 'accepted' | 'completed';
  createdAt: string;
}

export interface BookingRecord {
  id: string;
  restaurantId: string;
  customerId: string | null;
  date: string;
  time: string;
  partySize: number;
  createdAt: string;
}

export interface ReviewRecord {
  id: string;
  restaurantId: string;
  customerId: string | null;
  rating: number;
  comment: string;
  createdAt: string;
}

interface StorageShape {
  restaurants: RestaurantProfile[];
  menuItems: MenuItem[];
  customers: CustomerProfile[];
  orders: OrderRecord[];
  bookings: BookingRecord[];
  reviews: ReviewRecord[];
  sessions: {
    restaurantId: string | null;
    customerId: string | null;
  };
}

const STORAGE_KEY = 'rms-store';

const defaultStore: StorageShape = {
  restaurants: [],
  menuItems: [],
  customers: [],
  orders: [],
  bookings: [],
  reviews: [],
  sessions: {
    restaurantId: null,
    customerId: null
  }
};

const loadStore = (): StorageShape => {
  if (typeof window === 'undefined') {
    return defaultStore;
  }
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    return defaultStore;
  }
  try {
    return JSON.parse(raw) as StorageShape;
  } catch {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultStore));
    return defaultStore;
  }
};

const saveStore = (store: StorageShape) => {
  if (typeof window === 'undefined') {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

const generateId = (prefix: string) => `${prefix}-${crypto.randomUUID()}`;

export const storage = {
  getStore() {
    return loadStore();
  },
  getRestaurants() {
    return loadStore().restaurants;
  },
  addRestaurant(data: Omit<RestaurantProfile, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newRestaurant: RestaurantProfile = {
      ...data,
      id: generateId('rest'),
      createdAt: new Date().toISOString()
    };
    store.restaurants.push(newRestaurant);
    saveStore(store);
    return newRestaurant;
  },
  findRestaurantByEmail(email: string) {
    return loadStore().restaurants.find((restaurant) => restaurant.email === email);
  },
  getRestaurantById(id: string) {
    return loadStore().restaurants.find((restaurant) => restaurant.id === id) ?? null;
  },
  updateRestaurant(updated: RestaurantProfile) {
    const store = loadStore();
    store.restaurants = store.restaurants.map((restaurant) =>
      restaurant.id === updated.id ? updated : restaurant
    );
    saveStore(store);
  },
  getMenuItems(restaurantId: string) {
    return loadStore().menuItems.filter((item) => item.restaurantId === restaurantId);
  },
  addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id' | 'restaurantId'>) {
    const store = loadStore();
    const newItem: MenuItem = {
      ...item,
      id: generateId('menu'),
      restaurantId
    };
    store.menuItems.push(newItem);
    saveStore(store);
    return newItem;
  },
  updateMenuItem(updated: MenuItem) {
    const store = loadStore();
    store.menuItems = store.menuItems.map((item) => (item.id === updated.id ? updated : item));
    saveStore(store);
  },
  deleteMenuItem(id: string) {
    const store = loadStore();
    store.menuItems = store.menuItems.filter((item) => item.id !== id);
    saveStore(store);
  },
  addCustomer(data: Omit<CustomerProfile, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newCustomer: CustomerProfile = {
      ...data,
      id: generateId('cust'),
      createdAt: new Date().toISOString()
    };
    store.customers.push(newCustomer);
    saveStore(store);
    return newCustomer;
  },
  findCustomerByEmail(email: string) {
    return loadStore().customers.find((customer) => customer.email === email);
  },
  getCustomerById(id: string) {
    return loadStore().customers.find((customer) => customer.id === id) ?? null;
  },
  addOrder(order: Omit<OrderRecord, 'id' | 'createdAt' | 'status'>) {
    const store = loadStore();
    const newOrder: OrderRecord = {
      ...order,
      id: generateId('order'),
      status: 'placed',
      createdAt: new Date().toISOString()
    };
    store.orders.push(newOrder);
    saveStore(store);
    return newOrder;
  },
  getOrdersByRestaurant(restaurantId: string) {
    return loadStore().orders.filter((order) => order.restaurantId === restaurantId);
  },
  addBooking(booking: Omit<BookingRecord, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newBooking: BookingRecord = {
      ...booking,
      id: generateId('booking'),
      createdAt: new Date().toISOString()
    };
    store.bookings.push(newBooking);
    saveStore(store);
    return newBooking;
  },
  getBookingsByRestaurant(restaurantId: string) {
    return loadStore().bookings.filter((booking) => booking.restaurantId === restaurantId);
  },
  addReview(review: Omit<ReviewRecord, 'id' | 'createdAt'>) {
    const store = loadStore();
    const newReview: ReviewRecord = {
      ...review,
      id: generateId('review'),
      createdAt: new Date().toISOString()
    };
    store.reviews.push(newReview);
    saveStore(store);
    return newReview;
  },
  getReviewsByRestaurant(restaurantId: string) {
    return loadStore().reviews.filter((review) => review.restaurantId === restaurantId);
  },
  setRestaurantSession(id: string | null) {
    const store = loadStore();
    store.sessions.restaurantId = id;
    saveStore(store);
  },
  setCustomerSession(id: string | null) {
    const store = loadStore();
    store.sessions.customerId = id;
    saveStore(store);
  },
  getSessions() {
    return loadStore().sessions;
  }
};

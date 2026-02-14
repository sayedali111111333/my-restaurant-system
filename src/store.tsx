import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type MenuItem = { id: string; name: string; description: string; price: number; discount: number; category: string; image: string };
export type CartItem = MenuItem & { quantity: number; notes?: string };
export type OrderStatus = "waiting" | "preparing" | "ready" | "done";
export type OrderType = "dine-in" | "takeaway" | "delivery";
export type PaymentMethod = "cash" | "card" | "receipt";

export type Order = {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  type: OrderType;
  paymentMethod: PaymentMethod;
  customerPhone?: string;
  customerName?: string;
  timestamp: number;
};

export type Customer = { id: string; code: string; name: string; phone: string; totalOrders: number };
export type Settings = {
  restaurantName: string;
  slogan: string;
  phone: string;
  whatsapp: string;
  address: string;
  taxNumber: string;
  deliveryFee: number;
  theme: string;
  paymentMethods: { cash: boolean; card: boolean; receipt: boolean };
};

type StoreContextType = {
  menu: MenuItem[];
  setMenu: (menu: MenuItem[]) => void;
  cart: CartItem[];
  setCart: (cart: CartItem[] | ((prev: CartItem[]) => CartItem[])) => void;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  customers: Customer[];
  setCustomers: (customers: Customer[]) => void;
  settings: Settings;
  setSettings: (settings: Settings) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (val: boolean) => void;
  addToCart: (item: MenuItem, quantity: number) => void;
  removeFromCart: (id: string) => void;
  updateCartQuantity: (id: string, quantity: number) => void;
};

const defaultSettings: Settings = {
  restaurantName: "مطعم السعادة",
  slogan: "طعم لا ينسى",
  phone: "01000000000",
  whatsapp: "01000000000",
  address: "شارع التحرير، القاهرة",
  taxNumber: "123-456-789",
  deliveryFee: 20,
  theme: "default",
  paymentMethods: { cash: true, card: true, receipt: true },
};

const initialMenu: MenuItem[] = [
  { id: "1", name: "برجر كلاسيك", description: "شريحة لحم بقري، جبنة، خس، طماطم", price: 150, discount: 0, category: "وجبات سريعة", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=80" },
  { id: "2", name: "مشويات مشكلة", description: "كباب، كفتة، شيش طاووق مع الأرز", price: 350, discount: 50, category: "مشويات", image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&q=80" },
  { id: "3", name: "سلطة سيزر", description: "خس، دجاج مشوي، صوص سيزر", price: 90, discount: 0, category: "سلطات", image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?w=400&q=80" },
  { id: "4", name: "عصير برتقال فريش", description: "عصير برتقال طازج", price: 40, discount: 0, category: "مشروبات", image: "https://images.unsplash.com/photo-1613478223719-2ab802602423?w=400&q=80" },
];

export const StoreContext = createContext<StoreContextType | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  // DB Table: Menu Items
  const [menu, setMenu] = useState<MenuItem[]>(() => {
    const saved = localStorage.getItem("db_menu");
    return saved ? JSON.parse(saved) : initialMenu;
  });

  // DB Table: Temporary Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem("db_cart");
    return saved ? JSON.parse(saved) : [];
  });

  // DB Table: Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem("db_orders");
    return saved ? JSON.parse(saved) : [];
  });

  // DB Table: Customers
  const [customers, setCustomers] = useState<Customer[]>(() => {
    const saved = localStorage.getItem("db_customers");
    return saved ? JSON.parse(saved) : [
      { id: "1", code: "C-1001", name: "أحمد محمد", phone: "01111111111", totalOrders: 5 },
    ];
  });
  
  const [settings, setSettings] = useState<Settings>(() => {
    const saved = localStorage.getItem("restaurant_settings");
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("is_admin") === "true";
  });

  // Sync Tables to Mock DB (LocalStorage)
  useEffect(() => { localStorage.setItem("db_menu", JSON.stringify(menu)); }, [menu]);
  useEffect(() => { localStorage.setItem("db_cart", JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem("db_orders", JSON.stringify(orders)); }, [orders]);
  useEffect(() => { localStorage.setItem("db_customers", JSON.stringify(customers)); }, [customers]);

  useEffect(() => {
    localStorage.setItem("restaurant_settings", JSON.stringify(settings));
    document.documentElement.setAttribute("data-theme", settings.theme);
  }, [settings]);

  useEffect(() => {
    localStorage.setItem("is_admin", String(isAuthenticated));
  }, [isAuthenticated]);

  const addToCart = (item: MenuItem, quantity: number) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...prev, { ...item, quantity }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const updateCartQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    setCart((prev) => prev.map((i) => (i.id === id ? { ...i, quantity } : i)));
  };

  return (
    <StoreContext.Provider value={{ menu, setMenu, cart, setCart, orders, setOrders, customers, setCustomers, settings, setSettings, isAuthenticated, setIsAuthenticated, addToCart, removeFromCart, updateCartQuantity }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useStore must be used within StoreProvider");
  return context;
}
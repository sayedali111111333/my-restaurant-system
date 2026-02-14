import { useState, useMemo } from "react";
import { useStore, MenuItem, CartItem, OrderType, PaymentMethod, Customer } from "../store";
import { Search, Plus, Minus, Trash2, Printer, Store, Bike, UtensilsCrossed, UserPlus, CreditCard, Banknote, FileText } from "lucide-react";

export default function AdminPOS() {
  const { menu, customers, setCustomers, orders, setOrders } = useStore();
  
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("الكل");
  const [orderType, setOrderType] = useState<OrderType>("dine-in");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  
  // Customer State
  const [customerSearch, setCustomerSearch] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showNewCustomer, setShowNewCustomer] = useState(false);
  const [newCustomerName, setNewCustomerName] = useState("");
  const [newCustomerPhone, setNewCustomerPhone] = useState("");

  const categories = useMemo(() => ["الكل", ...Array.from(new Set(menu.map(m => m.category)))], [menu]);

  const filteredMenu = menu.filter(m => 
    (category === "الكل" || m.category === category) &&
    (m.name.includes(searchTerm) || m.description.includes(searchTerm))
  );

  const subtotal = cart.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0);

  const handleCustomerSearch = (val: string) => {
    setCustomerSearch(val);
    if (val.length > 3) {
      const found = customers.find(c => c.phone.includes(val) || c.code.includes(val));
      if (found) setSelectedCustomer(found);
      else setSelectedCustomer(null);
    } else {
      setSelectedCustomer(null);
    }
  };

  const handleCreateCustomer = () => {
    if (!newCustomerName || !newCustomerPhone) return;
    const customer = {
      id: Date.now().toString(),
      code: `C-${1000 + customers.length + 1}`,
      name: newCustomerName,
      phone: newCustomerPhone,
      totalOrders: 0
    };
    setCustomers([...customers, customer]);
    setSelectedCustomer(customer);
    setShowNewCustomer(false);
    setCustomerSearch(customer.phone);
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.id === id) {
        const newQ = i.quantity + delta;
        return newQ > 0 ? { ...i, quantity: newQ } : i;
      }
      return i;
    }));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    
    const newOrder = {
      id: Math.random().toString(36).substr(2, 9),
      items: cart,
      total: subtotal,
      status: "ready" as const, // POS orders are typically ready immediately or sent to kitchen
      type: orderType,
      paymentMethod,
      customerPhone: selectedCustomer?.phone,
      customerName: selectedCustomer?.name,
      timestamp: Date.now(),
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setSelectedCustomer(null);
    setCustomerSearch("");
    alert("تم تسجيل الطلب بنجاح");
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-8rem)] animate-in fade-in duration-500">
      
      {/* Left Side: Menu Grid */}
      <div className="flex-1 flex flex-col min-w-0 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث في المنيو..."
              className="w-full pl-4 pr-10 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide shrink-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-5 py-3 rounded-xl whitespace-nowrap text-sm font-bold transition-all shadow-sm ${
                  category === cat
                    ? "bg-primary-600 text-white shadow-primary-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-max">
          {filteredMenu.map(item => (
            <button
              key={item.id}
              onClick={() => addToCart(item)}
              className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-primary-500 hover:shadow-md transition-all group flex flex-col text-right h-full"
            >
              <div className="h-32 w-full bg-gray-100 relative overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h3 className="font-bold text-gray-900 line-clamp-2 mb-1 leading-tight">{item.name}</h3>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-primary-600 font-bold text-lg">{item.price - item.discount} <span className="text-xs text-gray-500 font-normal">ج.م</span></span>
                  <div className="w-8 h-8 rounded-full bg-primary-50 flex items-center justify-center text-primary-600 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                    <Plus className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Right Side: Cart / Checkout */}
      <div className="w-full lg:w-96 flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 shrink-0 h-[600px] lg:h-auto">
        
        {/* Customer Search */}
        <div className="p-4 border-b border-gray-100 bg-gray-50/50">
          {!showNewCustomer ? (
            <div className="relative">
              <input
                type="text"
                placeholder="رقم الهاتف أو كود العميل..."
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm text-sm font-medium"
                value={customerSearch}
                onChange={(e) => handleCustomerSearch(e.target.value)}
                dir="ltr"
              />
              <button
                onClick={() => setShowNewCustomer(true)}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-primary-600 hover:bg-primary-50 rounded-lg transition-colors"
                title="إضافة عميل"
              >
                <UserPlus className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="space-y-3 bg-white p-4 rounded-xl border border-primary-100 shadow-sm animate-in zoom-in-95 duration-200">
              <h4 className="font-bold text-gray-900 text-sm mb-2">تسجيل عميل جديد</h4>
              <input type="text" placeholder="اسم العميل" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500" value={newCustomerName} onChange={e => setNewCustomerName(e.target.value)} />
              <input type="text" placeholder="رقم الهاتف" className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm outline-none focus:border-primary-500 text-left" dir="ltr" value={newCustomerPhone} onChange={e => setNewCustomerPhone(e.target.value)} />
              <div className="flex gap-2 pt-2">
                <button onClick={handleCreateCustomer} className="flex-1 bg-primary-600 text-white py-2 rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors">حفظ</button>
                <button onClick={() => setShowNewCustomer(false)} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 transition-colors">إلغاء</button>
              </div>
            </div>
          )}
          
          {selectedCustomer && !showNewCustomer && (
            <div className="mt-3 p-3 bg-blue-50 border border-blue-100 rounded-xl flex items-center justify-between animate-in fade-in slide-in-from-top-2">
              <div>
                <p className="font-bold text-blue-900 text-sm">{selectedCustomer.name}</p>
                <p className="text-xs text-blue-700 mt-0.5">{selectedCustomer.code}</p>
              </div>
              <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(""); }} className="text-blue-500 hover:text-blue-700 p-1 hover:bg-blue-100 rounded-md transition-colors">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Order Type & Items */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="grid grid-cols-3 gap-2 p-4 border-b border-gray-100">
            {[
              { id: "dine-in", label: "صالة", icon: UtensilsCrossed },
              { id: "takeaway", label: "تيك أواي", icon: Store },
              { id: "delivery", label: "توصيل", icon: Bike },
            ].map(type => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => setOrderType(type.id as OrderType)}
                  className={`flex flex-col items-center justify-center py-2.5 rounded-xl border-2 transition-all ${
                    orderType === type.id ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm" : "border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-gray-200"
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5" />
                  <span className="text-xs font-bold">{type.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400">
                <Store className="w-12 h-12 mb-3 text-gray-300" />
                <p className="font-medium">أضف أصناف لإنشاء طلب</p>
              </div>
            ) : (
              cart.map(item => (
                <div key={item.id} className="flex flex-col bg-white border border-gray-100 rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold text-gray-900 text-sm pr-2">{item.name}</span>
                    <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-gray-400 hover:text-red-500 p-1 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-2 border-t border-gray-50 pt-2">
                    <span className="font-bold text-primary-600 text-sm">{(item.price - item.discount) * item.quantity} ج.م</span>
                    <div className="flex items-center gap-3 bg-gray-50 px-2 py-1 rounded-lg border border-gray-200">
                      <button onClick={() => updateQuantity(item.id, -1)} className="text-gray-500 hover:text-primary-600 p-0.5"><Minus className="w-4 h-4" /></button>
                      <span className="font-bold text-gray-900 w-4 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="text-gray-500 hover:text-primary-600 p-0.5"><Plus className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Totals & Actions */}
        <div className="p-4 bg-gray-50 border-t border-gray-100 shrink-0">
          <div className="space-y-2 mb-4">
            <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">طريقة الدفع</h4>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "cash", label: "نقدي", icon: Banknote },
                { id: "card", label: "بطاقة", icon: CreditCard },
                { id: "receipt", label: "إيصال", icon: FileText },
              ].map(method => {
                const Icon = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-lg border-2 text-xs font-bold transition-all ${
                      paymentMethod === method.id ? "border-primary-500 bg-primary-50 text-primary-700" : "border-gray-200 bg-white text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {method.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between items-center mb-4 pt-3 border-t border-gray-200">
            <span className="text-gray-600 font-bold">الإجمالي المطلوب</span>
            <span className="text-2xl font-bold text-primary-600">{subtotal} <span className="text-base text-gray-500 font-normal">ج.م</span></span>
          </div>

          <div className="flex gap-2">
            <button className="p-4 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-xl transition-colors font-bold flex items-center justify-center border border-gray-300 shadow-sm" title="طباعة الفاتورة">
              <Printer className="w-5 h-5" />
            </button>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className={`flex-1 py-4 rounded-xl font-bold text-lg shadow-lg transition-all flex items-center justify-center gap-2 ${
                cart.length > 0 ? "bg-primary-600 text-white hover:bg-primary-700 shadow-primary-200" : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              تأكيد الدفع
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
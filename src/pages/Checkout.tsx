import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useStore, Order, OrderType, PaymentMethod } from "../store";
import { CheckCircle2, AlertCircle, ShoppingBag } from "lucide-react";

export default function Checkout() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { cart, setCart, orders, setOrders, settings, customers, setCustomers } = useStore();
  
  const [orderType] = useState<OrderType>((searchParams.get("type") as OrderType) || "takeaway");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const subtotal = cart.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0);
  const deliveryFee = orderType === "delivery" ? settings.deliveryFee : 0;
  const total = subtotal + deliveryFee;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone || (orderType === "delivery" && !address)) {
      setError("برجاء إكمال جميع البيانات المطلوبة");
      return;
    }

    // Handle customer
    let customer = customers.find(c => c.phone === phone);
    if (!customer) {
      customer = {
        id: Date.now().toString(),
        code: `C-${1000 + customers.length + 1}`,
        name,
        phone,
        totalOrders: 1
      };
      setCustomers([...customers, customer]);
    } else {
      setCustomers(customers.map(c => c.id === customer!.id ? { ...c, totalOrders: c.totalOrders + 1 } : c));
    }

    const newOrder: Order = {
      id: Math.random().toString(36).substr(2, 9),
      items: [...cart],
      total,
      status: "waiting",
      type: orderType,
      paymentMethod,
      customerPhone: phone,
      customerName: name,
      timestamp: Date.now(),
    };

    setOrders([newOrder, ...orders]);
    setCart([]);
    setIsSuccess(true);

    // Format WhatsApp Message
    const itemsText = newOrder.items.map(item => `- ${item.name} (${item.quantity})`).join('%0A');
    const message = `طلب جديد من ${name}%0Aرقم الطلب: ${newOrder.id}%0Aالنوع: ${orderType === 'delivery' ? 'توصيل' : orderType === 'takeaway' ? 'تيك أواي' : 'صالة'}%0A%0Aالطلبات:%0A${itemsText}%0A%0Aالإجمالي: ${total} ج.م%0A${address ? `العنوان: ${address}` : ''}`;
    
    // Open WhatsApp in new tab
    if (settings.whatsapp) {
      window.open(`https://wa.me/${settings.whatsapp}?text=${message}`, '_blank');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 animate-in zoom-in-95 duration-500">
        <CheckCircle2 className="w-24 h-24 text-green-500 mb-6 animate-bounce" />
        <h2 className="text-3xl font-bold text-gray-900 mb-4">تم تأكيد طلبك بنجاح!</h2>
        <p className="text-gray-500 mb-8 max-w-md text-center text-lg">شكراً لطلبك. سنتواصل معك قريباً لتأكيد التفاصيل.</p>
        <Link
          to="/"
          className="bg-primary-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 text-lg"
        >
          العودة للقائمة الرئيسية
        </Link>
      </div>
    );
  }

  if (cart.length === 0) {
    navigate("/");
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="p-6 sm:p-8 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary-600" />
          تأكيد الطلب
        </h1>
        <span className="text-sm font-medium text-gray-500 bg-white px-3 py-1 rounded-full border border-gray-200">
          خطوة أخيرة
        </span>
      </div>

      <div className="p-6 sm:p-8 grid md:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-2 text-sm font-medium border border-red-100">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">الاسم</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all"
                placeholder="أدخل اسمك الكريم"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">رقم الهاتف</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-left dir-ltr"
                placeholder="01xxxxxxxxx"
                dir="ltr"
              />
            </div>

            {orderType === "delivery" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">عنوان التوصيل</label>
                <textarea
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all h-24 resize-none"
                  placeholder="الشارع، العمارة، رقم الشقة..."
                />
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-gray-100">
            <h3 className="font-medium text-gray-900 mb-4">طريقة الدفع</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { id: "cash", label: "كاش" },
                { id: "card", label: "فيزا / ماستركارد" }
              ].map(method => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setPaymentMethod(method.id as PaymentMethod)}
                  className={`py-3 px-4 rounded-xl border-2 font-medium transition-all ${
                    paymentMethod === method.id 
                      ? "border-primary-500 bg-primary-50 text-primary-700" 
                      : "border-gray-200 text-gray-600 hover:border-gray-300"
                  }`}
                >
                  {method.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 mt-8"
          >
            إرسال الطلب
          </button>
        </form>

        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-fit">
          <h3 className="font-bold text-gray-900 mb-4 pb-4 border-b border-gray-200">ملخص الطلب ({cart.length} أصناف)</h3>
          
          <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.id} className="flex justify-between items-start text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-gray-900">{item.quantity}x</span>
                  <span className="text-gray-600">{item.name}</span>
                </div>
                <span className="font-medium text-gray-900 whitespace-nowrap">{(item.price - item.discount) * item.quantity} ج.م</span>
              </div>
            ))}
          </div>

          <div className="space-y-3 pt-4 border-t border-gray-200 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>المجموع الفرعي</span>
              <span>{subtotal} ج.م</span>
            </div>
            {deliveryFee > 0 && (
              <div className="flex justify-between text-gray-600">
                <span>رسوم التوصيل</span>
                <span>{deliveryFee} ج.م</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-lg text-gray-900 pt-3 border-t border-gray-200 mt-3">
              <span>الإجمالي المستحق</span>
              <span className="text-primary-600">{total} ج.م</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
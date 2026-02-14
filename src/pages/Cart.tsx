import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus, ArrowRight, Store, Bike, UtensilsCrossed } from "lucide-react";
import { useStore, OrderType } from "../store";
import { useState } from "react";

export default function Cart() {
  const { cart, removeFromCart, updateCartQuantity } = useStore();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState<OrderType>("takeaway");

  const subtotal = cart.reduce((sum, item) => sum + (item.price - item.discount) * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100 min-h-[50vh] animate-in fade-in zoom-in-95 duration-300">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <Trash2 className="w-10 h-10 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">سلة المشتريات فارغة</h2>
        <p className="text-gray-500 mb-8 max-w-sm text-center">يبدو أنك لم تقم بإضافة أي وجبات لذيذة إلى سلتك بعد!</p>
        <Link
          to="/"
          className="bg-primary-600 text-white px-8 py-3 rounded-full font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center gap-2"
        >
          <ArrowRight className="w-5 h-5" />
          تصفح المنيو
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
      {/* Cart Items */}
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <span>سلة المشتريات</span>
          <span className="bg-primary-100 text-primary-700 text-sm py-1 px-3 rounded-full">{cart.length} أصناف</span>
        </h1>
        
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden divide-y divide-gray-50">
          {cart.map((item) => (
            <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 hover:bg-gray-50 transition-colors">
              <img src={item.image} alt={item.name} className="w-24 h-24 object-cover rounded-xl shadow-sm" />
              
              <div className="flex-1 text-center sm:text-right">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{item.name}</h3>
                <p className="text-primary-600 font-semibold mb-2">{(item.price - item.discount)} ج.م</p>
                <div className="flex items-center justify-center sm:justify-start gap-4 text-gray-500 text-sm">
                  {item.discount > 0 && <span className="line-through">{item.price} ج.م</span>}
                </div>
              </div>

              <div className="flex items-center gap-4 bg-gray-100 p-1.5 rounded-xl border border-gray-200">
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-red-600 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-900">{item.quantity}</span>
                <button
                  onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 flex items-center justify-center bg-white rounded-lg shadow-sm text-gray-600 hover:text-primary-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors sm:self-start"
                title="حذف"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Order Summary */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
          <h2 className="text-xl font-bold text-gray-900 mb-6">ملخص الطلب</h2>
          
          <div className="space-y-4 mb-8">
            <h3 className="font-semibold text-gray-700">نوع الطلب:</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "dine-in", label: "صالة", icon: UtensilsCrossed },
                { id: "takeaway", label: "تيك أواي", icon: Store },
                { id: "delivery", label: "توصيل", icon: Bike },
              ].map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.id}
                    onClick={() => setOrderType(type.id as OrderType)}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${
                      orderType === type.id
                        ? "border-primary-500 bg-primary-50 text-primary-700 shadow-sm"
                        : "border-gray-100 hover:border-gray-200 text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    <Icon className="w-6 h-6 mb-2" />
                    <span className="text-sm font-medium">{type.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="space-y-3 text-sm text-gray-600 mb-6 border-t border-gray-100 pt-6">
            <div className="flex justify-between">
              <span>المجموع الفرعي</span>
              <span className="font-medium text-gray-900">{subtotal} ج.م</span>
            </div>
            {orderType === "delivery" && (
              <div className="flex justify-between">
                <span>رسوم التوصيل</span>
                <span className="font-medium text-gray-900">20 ج.م</span>
              </div>
            )}
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-gray-900 mb-8 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <span>الإجمالي</span>
            <span className="text-2xl text-primary-600">
              {subtotal + (orderType === "delivery" ? 20 : 0)} ج.م
            </span>
          </div>

          <button
            onClick={() => navigate(`/checkout?type=${orderType}`)}
            className="w-full bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            متابعة للدفع
          </button>
        </div>
      </div>
    </div>
  );
}
import { useState } from "react";
import { useStore, OrderStatus, OrderType } from "../store";
import { Clock, CheckCircle2, Package, Search, Printer, MessageCircle, AlertCircle } from "lucide-react";

const statusMap: Record<OrderStatus, { label: string; color: string; icon: any }> = {
  waiting: { label: "في الانتظار", color: "bg-amber-100 text-amber-700 border-amber-200", icon: Clock },
  preparing: { label: "قيد التحضير", color: "bg-blue-100 text-blue-700 border-blue-200", icon: Package },
  ready: { label: "جاهز", color: "bg-purple-100 text-purple-700 border-purple-200", icon: CheckCircle2 },
  done: { label: "تم التسليم", color: "bg-green-100 text-green-700 border-green-200", icon: CheckCircle2 },
};

const typeMap: Record<OrderType, string> = {
  "dine-in": "صالة",
  takeaway: "تيك أواي",
  delivery: "توصيل",
};

export default function AdminOrders() {
  const { orders, setOrders, settings } = useStore();
  const [filter, setFilter] = useState<OrderStatus | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredOrders = orders.filter((order) => {
    const matchesFilter = filter === "all" || order.status === filter;
    const matchesSearch =
      order.id.includes(searchTerm) ||
      (order.customerName && order.customerName.includes(searchTerm)) ||
      (order.customerPhone && order.customerPhone.includes(searchTerm));
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (orderId: string, newStatus: OrderStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = (phone: string, id: string) => {
    if (!phone) return;
    const msg = `مرحباً، طلبك رقم ${id} من ${settings.restaurantName} جاهز الآن!`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-900">إدارة الطلبات</h1>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="بحث برقم الطلب أو العميل..."
              className="w-full pr-10 pl-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 scrollbar-hide">
            {["all", "waiting", "preparing", "ready", "done"].map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status as any)}
                className={`px-4 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all shadow-sm ${
                  filter === status
                    ? "bg-primary-600 text-white shadow-primary-200"
                    : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                {status === "all" ? "الكل" : statusMap[status as OrderStatus].label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">لا توجد طلبات</h3>
            <p className="text-gray-500">لم يتم العثور على أي طلبات تطابق بحثك الحالي.</p>
          </div>
        ) : (
          filteredOrders.map((order) => {
            const StatusIcon = statusMap[order.status].icon;
            return (
              <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-gray-50 flex flex-col sm:flex-row justify-between gap-4 bg-gray-50/50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center font-bold text-lg shadow-sm">
                      #{order.id.slice(0,4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{order.customerName || "عميل غير مسجل"}</h3>
                        <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-md font-medium">
                          {typeMap[order.type]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 font-medium" dir="ltr">{order.customerPhone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold text-sm ${statusMap[order.status].color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {statusMap[order.status].label}
                    </div>
                    
                    <span className="text-2xl font-bold text-primary-600">{order.total} <span className="text-sm text-gray-500 font-normal">ج.م</span></span>
                  </div>
                </div>

                <div className="p-4 sm:p-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">تفاصيل الطلب</h4>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm items-center bg-gray-50 p-2 rounded-lg border border-gray-100">
                            <div className="flex gap-3">
                              <span className="font-bold text-primary-600">{item.quantity}x</span>
                              <span className="text-gray-800 font-medium">{item.name}</span>
                            </div>
                            <span className="text-gray-500 font-medium whitespace-nowrap">{(item.price - item.discount) * item.quantity} ج.م</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col justify-end gap-3 sm:border-r sm:border-gray-100 sm:pr-6">
                      <div className="flex flex-wrap gap-2 justify-end mb-4">
                        {order.status === "waiting" && (
                          <button onClick={() => updateStatus(order.id, "preparing")} className="px-4 py-2 bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white rounded-lg font-bold transition-colors border border-blue-200 hover:border-blue-600 flex-1 sm:flex-none">
                            تحضير
                          </button>
                        )}
                        {order.status === "preparing" && (
                          <button onClick={() => updateStatus(order.id, "ready")} className="px-4 py-2 bg-purple-50 text-purple-600 hover:bg-purple-600 hover:text-white rounded-lg font-bold transition-colors border border-purple-200 hover:border-purple-600 flex-1 sm:flex-none">
                            جاهز
                          </button>
                        )}
                        {order.status === "ready" && (
                          <button onClick={() => updateStatus(order.id, "done")} className="px-4 py-2 bg-green-50 text-green-600 hover:bg-green-600 hover:text-white rounded-lg font-bold transition-colors border border-green-200 hover:border-green-600 flex-1 sm:flex-none">
                            تم التسليم
                          </button>
                        )}
                      </div>

                      <div className="flex gap-2 justify-end">
                        <button onClick={handlePrint} className="p-2.5 text-gray-500 bg-gray-50 hover:bg-gray-200 hover:text-gray-900 rounded-lg transition-colors border border-gray-200 shadow-sm" title="طباعة">
                          <Printer className="w-5 h-5" />
                        </button>
                        {order.customerPhone && (
                          <button onClick={() => handleWhatsApp(order.customerPhone!, order.id)} className="p-2.5 text-green-600 bg-green-50 hover:bg-green-600 hover:text-white rounded-lg transition-colors border border-green-200 shadow-sm flex items-center gap-2" title="واتساب">
                            <MessageCircle className="w-5 h-5" />
                            <span className="text-sm font-bold hidden sm:inline">إرسال للعميل</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
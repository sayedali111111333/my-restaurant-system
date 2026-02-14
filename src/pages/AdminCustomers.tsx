import { useState } from "react";
import { useStore } from "../store";
import { Search, Users, UserPlus, Phone, Hash, ShoppingBag } from "lucide-react";

export default function AdminCustomers() {
  const { customers } = useStore();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCustomers = customers.filter(
    (customer) =>
      customer.name.includes(searchTerm) ||
      customer.phone.includes(searchTerm) ||
      customer.code.includes(searchTerm)
  );

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">قاعدة العملاء</h1>
          <p className="text-gray-500">إدارة بيانات العملاء وتتبع تاريخ طلباتهم.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
          <UserPlus className="w-5 h-5" />
          إضافة عميل جديد
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <div className="relative w-full sm:max-w-md">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="ابحث بالاسم، رقم الهاتف، أو كود العميل..."
              className="w-full pr-10 pl-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">العميل</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">كود العميل</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">رقم الهاتف</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">إجمالي الطلبات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredCustomers.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg shadow-sm">
                        {customer.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base">{customer.name}</div>
                        <div className="text-sm text-gray-500">تم التسجيل حديثاً</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold bg-gray-100 text-gray-700 border border-gray-200">
                      <Hash className="w-4 h-4 text-gray-400" />
                      {customer.code}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span dir="ltr">{customer.phone}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-bold bg-blue-50 text-blue-700 border border-blue-100">
                      <ShoppingBag className="w-4 h-4" />
                      {customer.totalOrders} طلبات
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredCustomers.length === 0 && (
          <div className="text-center py-16 bg-white">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">لا يوجد عملاء</h2>
            <p className="text-gray-500 max-w-sm mx-auto">لم يتم العثور على أي عملاء يطابقون بحثك. يمكنك إضافة عميل جديد أو تغيير كلمات البحث.</p>
          </div>
        )}
      </div>
    </div>
  );
}
import { useMemo } from "react";
import { useStore } from "../store";
import { TrendingUp, Users, ShoppingBag, DollarSign } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

export default function AdminDashboard() {
  const { orders, customers } = useStore();

  const stats = useMemo(() => {
    const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
    const todayOrders = orders.filter(o => {
      const today = new Date().setHours(0,0,0,0);
      return o.timestamp >= today;
    });
    const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

    return {
      revenue: totalRevenue,
      todayRevenue,
      totalOrders: orders.length,
      todayOrders: todayOrders.length,
      totalCustomers: customers.length,
    };
  }, [orders, customers]);

  // Mock data for charts
  const weeklyData = [
    { name: "السبت", sales: 4000 },
    { name: "الأحد", sales: 3000 },
    { name: "الإثنين", sales: 2000 },
    { name: "الثلاثاء", sales: 2780 },
    { name: "الأربعاء", sales: 1890 },
    { name: "الخميس", sales: 2390 },
    { name: "الجمعة", sales: 3490 },
  ];

  const orderTypesData = [
    { name: "صالة", value: orders.filter(o => o.type === "dine-in").length || 10 },
    { name: "تيك أواي", value: orders.filter(o => o.type === "takeaway").length || 20 },
    { name: "توصيل", value: orders.filter(o => o.type === "delivery").length || 15 },
  ];

  const COLORS = ['#8b5cf6', '#3b82f6', '#10b981'];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">نظرة عامة</h1>
        <div className="text-sm font-medium text-gray-500 bg-white px-4 py-2 rounded-full border border-gray-200 shadow-sm">
          تحديث مباشر
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "إجمالي المبيعات", value: `${stats.revenue} ج.م`, icon: DollarSign, color: "bg-green-100 text-green-600" },
          { title: "مبيعات اليوم", value: `${stats.todayRevenue} ج.م`, icon: TrendingUp, color: "bg-blue-100 text-blue-600" },
          { title: "إجمالي الطلبات", value: stats.totalOrders, icon: ShoppingBag, color: "bg-purple-100 text-purple-600" },
          { title: "العملاء", value: stats.totalCustomers, icon: Users, color: "bg-orange-100 text-orange-600" },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-4 hover:shadow-md transition-shadow">
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-8 h-8" />
              </div>
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-6">المبيعات الأسبوعية</h3>
          <div className="h-80 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f9fafb'}} contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="sales" fill="var(--color-primary-500)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-900 mb-6">أنواع الطلبات</h3>
          <div className="h-64 w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={orderTypesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {orderTypesData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-6">
            {orderTypesData.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{backgroundColor: COLORS[index]}}></div>
                <span className="text-sm font-medium text-gray-600">{entry.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
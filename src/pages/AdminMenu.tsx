import { useState, useMemo } from "react";
import { useStore } from "../store";
import { Plus, Search, Edit, Trash2, Tag, Image as ImageIcon } from "lucide-react";

export default function AdminMenu() {
  const { menu, setMenu } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");

  const categories = useMemo(() => {
    const cats = new Set(menu.map((item) => item.category));
    return ["الكل", ...Array.from(cats)];
  }, [menu]);

  const filteredMenu = useMemo(() => {
    return menu.filter((item) => {
      const matchesSearch = item.name.includes(searchTerm) || item.description.includes(searchTerm);
      const matchesCategory = activeCategory === "الكل" || item.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [menu, searchTerm, activeCategory]);

  const handleDelete = (id: string) => {
    if (confirm("هل أنت متأكد من حذف هذا الصنف؟")) {
      setMenu(menu.filter((item) => item.id !== id));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">إدارة المنيو</h1>
          <p className="text-gray-500">إضافة، تعديل، وحذف الأصناف والوجبات.</p>
        </div>
        <button className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200">
          <Plus className="w-5 h-5" />
          إضافة صنف جديد
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن صنف..."
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap text-sm font-bold transition-all shadow-sm ${
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-primary-200"
                  : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">الصنف</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">القسم</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">السعر</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider">الخصم</th>
                <th className="px-6 py-4 text-sm font-bold text-gray-500 uppercase tracking-wider text-left">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredMenu.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="h-full w-full object-cover group-hover:scale-110 transition-transform" />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center text-gray-400">
                            <ImageIcon className="w-6 h-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-base mb-1">{item.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1 max-w-xs">{item.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700 border border-primary-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-lg font-bold text-gray-900">{item.price} <span className="text-sm text-gray-500 font-normal">ج.م</span></div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {item.discount > 0 ? (
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold bg-red-50 px-3 py-1 rounded-lg border border-red-100">
                        <Tag className="w-4 h-4" />
                        {item.discount} ج.م
                      </span>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-left">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-transparent hover:border-blue-200" title="تعديل">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-200" title="حذف"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredMenu.length === 0 && (
          <div className="text-center py-12 bg-white">
            <Tag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-700 mb-2">لا يوجد أصناف</h2>
            <p className="text-gray-500">جرب البحث باسم آخر أو أضف صنف جديد.</p>
          </div>
        )}
      </div>
    </div>
  );
}
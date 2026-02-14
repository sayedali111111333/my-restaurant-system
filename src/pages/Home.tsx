import { useState, useMemo } from "react";
import { Search, Plus, X, ShoppingBag } from "lucide-react";
import { useStore, MenuItem } from "../store";

export default function Home() {
  const { menu, addToCart } = useStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [activeCategory, setActiveCategory] = useState("الكل");
  const [selectedMeal, setSelectedMeal] = useState<MenuItem | null>(null);

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

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white p-4 rounded-xl shadow-sm">
        <div className="relative w-full sm:w-96">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="ابحث عن وجبة..."
            className="w-full pr-10 pl-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex overflow-x-auto gap-2 pb-2 sm:pb-0 scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                activeCategory === cat
                  ? "bg-primary-600 text-white shadow-md shadow-primary-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredMenu.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow group cursor-pointer"
            onClick={() => setSelectedMeal(item)}
          >
            <div className="relative h-48 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {item.discount > 0 && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 text-xs font-bold rounded-md shadow-sm">
                  وفر {item.discount} ج.م
                </span>
              )}
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900 line-clamp-1 text-lg">{item.name}</h3>
                <span className="bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                  {item.category}
                </span>
              </div>
              <p className="text-gray-500 text-sm line-clamp-2 h-10 mb-4">{item.description}</p>
              
              <div className="flex justify-between items-center mt-auto">
                <div className="flex flex-col">
                  {item.discount > 0 ? (
                    <>
                      <span className="text-xl font-bold text-gray-900">{item.price - item.discount} ج.م</span>
                      <span className="text-sm text-gray-400 line-through">{item.price} ج.م</span>
                    </>
                  ) : (
                    <span className="text-xl font-bold text-gray-900">{item.price} ج.م</span>
                  )}
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(item, 1);
                  }}
                  className="bg-primary-50 text-primary-600 p-2 rounded-lg hover:bg-primary-600 hover:text-white transition-colors group-hover:shadow-md"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredMenu.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-700 mb-2">لا توجد وجبات!</h2>
          <p className="text-gray-500">جرب البحث بكلمات أخرى أو اختر قسم مختلف.</p>
        </div>
      )}

      {/* Meal Modal */}
      {selectedMeal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
            <div className="relative h-64">
              <img src={selectedMeal.image} alt={selectedMeal.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedMeal(null)}
                className="absolute top-4 left-4 bg-white/80 p-2 rounded-full hover:bg-white text-gray-800 transition-colors backdrop-blur-md shadow-sm"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedMeal.name}</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">{selectedMeal.description}</p>
              
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
                <span className="text-lg font-medium text-gray-500">السعر</span>
                <div className="text-left">
                  <span className="text-3xl font-bold text-primary-600 mr-2">
                    {selectedMeal.price - selectedMeal.discount} <span className="text-xl">ج.م</span>
                  </span>
                  {selectedMeal.discount > 0 && (
                    <span className="text-gray-400 line-through block">{selectedMeal.price} ج.م</span>
                  )}
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    addToCart(selectedMeal, 1);
                    setSelectedMeal(null);
                  }}
                  className="flex-1 bg-primary-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 flex items-center justify-center gap-2"
                >
                  <ShoppingBag className="w-5 h-5" />
                  أضف للسلة
                </button>
                <button
                  onClick={() => setSelectedMeal(null)}
                  className="px-6 py-4 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                >
                  إلغاء
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
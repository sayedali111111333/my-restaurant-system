import { Link, Outlet } from "react-router-dom";
import { ShoppingCart, LogIn } from "lucide-react";
import { useStore } from "../store";

export default function CustomerLayout() {
  const { cart, settings } = useStore();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <Link to="/" className="flex items-center space-x-2 space-x-reverse">
              <span className="text-2xl font-bold text-primary-600">{settings.restaurantName}</span>
              <span className="text-sm text-gray-500 hidden sm:inline-block">| {settings.slogan}</span>
            </Link>
            
            <div className="flex items-center space-x-4 space-x-reverse">
              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary-600 transition-colors">
                <ShoppingCart className="w-6 h-6" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-red-600 rounded-full">
                    {cartCount}
                  </span>
                )}
              </Link>
              <Link to="/login" className="flex items-center space-x-1 space-x-reverse text-gray-600 hover:text-primary-600">
                <LogIn className="w-5 h-5" />
                <span className="hidden sm:inline">الإدارة</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-2">
          <p className="font-bold">{settings.restaurantName}</p>
          <p className="text-sm text-gray-400">جميع الحقوق محفوظة © {new Date().getFullYear()}</p>
        </div>
      </footer>
    </div>
  );
}
import { Link, Outlet, useLocation, useNavigate, Navigate } from "react-router-dom";
import { LayoutDashboard, Menu as MenuIcon, ClipboardList, Users, MonitorSmartphone, Settings as SettingsIcon, LogOut } from "lucide-react";
import { useStore } from "../store";

export default function AdminLayout() {
  const { isAuthenticated, setIsAuthenticated, settings } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate("/login");
  };

  const navItems = [
    { name: "نظرة عامة", path: "/admin", icon: LayoutDashboard },
    { name: "إدارة المنيو", path: "/admin/menu", icon: MenuIcon },
    { name: "الطلبات", path: "/admin/orders", icon: ClipboardList },
    { name: "العملاء", path: "/admin/customers", icon: Users },
    { name: "الكاشير POS", path: "/admin/pos", icon: MonitorSmartphone },
    { name: "الإعدادات", path: "/admin/settings", icon: SettingsIcon },
  ];

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg flex-shrink-0 z-10 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <Link to="/" className="text-xl font-bold text-primary-600 truncate">{settings.restaurantName}</Link>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-3 space-x-reverse px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? "bg-primary-50 text-primary-600 font-semibold" 
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 space-x-reverse w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <span>تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 overflow-hidden">
        <header className="h-16 bg-white shadow-sm flex items-center px-6 shrink-0 md:hidden">
           {/* Mobile header placeholder */}
           <span className="text-xl font-bold text-primary-600">{settings.restaurantName}</span>
        </header>
        
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
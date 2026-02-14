import { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, User, ShieldAlert, Store } from "lucide-react";
import { useStore } from "../store";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { isAuthenticated, setIsAuthenticated, settings } = useStore();

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "123456") {
      setIsAuthenticated(true);
      navigate("/admin");
    } else {
      setError("بيانات الدخول غير صحيحة");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-4 sm:p-6 lg:p-8 relative overflow-hidden">
      
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-primary-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/50 relative z-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
        
        <div className="p-8 sm:p-10 space-y-8">
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-200 mb-6 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
              <Store className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              {settings.restaurantName}
            </h2>
            <p className="mt-2 text-sm text-gray-500 font-medium">تسجيل الدخول للوحة التحكم</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            {error && (
              <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-medium border border-red-100 animate-in shake duration-300">
                <ShieldAlert className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <input
                  type="text"
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="اسم المستخدم"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="relative group">
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary-600 transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  type="password"
                  required
                  className="w-full pl-4 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-gray-900 placeholder-gray-400 font-medium"
                  placeholder="كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <button
              type="submit"
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 shadow-lg shadow-primary-200/50 transform transition-all active:scale-[0.98] overflow-hidden"
            >
              <span className="absolute inset-0 w-full h-full -mt-1 rounded-lg opacity-30 bg-gradient-to-b from-transparent via-transparent to-black"></span>
              <span className="relative">دخول</span>
            </button>
            
            <div className="text-center text-sm text-gray-400 font-medium">
              البيانات الافتراضية: admin / 123456
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
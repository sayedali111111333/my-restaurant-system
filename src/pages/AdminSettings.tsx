import { useState } from "react";
import { useStore } from "../store";
import { Store, Palette, CreditCard, Save, CheckCircle2 } from "lucide-react";

export default function AdminSettings() {
  const { settings, setSettings } = useStore();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const themes = [
    { id: "default", name: "بنفسجي", color: "bg-purple-600" },
    { id: "blue", name: "أزرق", color: "bg-blue-600" },
    { id: "green", name: "أخضر", color: "bg-green-600" },
    { id: "red", name: "أحمر", color: "bg-red-600" },
    { id: "orange", name: "برتقالي", color: "bg-orange-600" },
    { id: "royal", name: "ملكي", color: "bg-slate-900" },
    { id: "rose", name: "روز", color: "bg-rose-600" },
    { id: "dark", name: "داكن", color: "bg-gray-800" },
  ];

  const handleSave = () => {
    setSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">الإعدادات</h1>
          <p className="text-gray-500">إدارة تفاصيل المطعم، المظهر، وطرق الدفع.</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200"
        >
          {saved ? <CheckCircle2 className="w-5 h-5" /> : <Save className="w-5 h-5" />}
          {saved ? "تم الحفظ بنجاح" : "حفظ التغييرات"}
        </button>
      </div>

      <div className="grid gap-8">
        {/* Restaurant Details */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <Store className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">بيانات المطعم</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">اسم المطعم</label>
              <input
                type="text"
                value={formData.restaurantName}
                onChange={(e) => setFormData({ ...formData, restaurantName: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">السلوجن (الشعار اللفظي)</label>
              <input
                type="text"
                value={formData.slogan}
                onChange={(e) => setFormData({ ...formData, slogan: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الهاتف</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left dir-ltr"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رقم الواتساب (لإرسال الطلبات)</label>
              <input
                type="text"
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left dir-ltr"
                dir="ltr"
                placeholder="201000000000"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-2">العنوان</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">الرقم الضريبي</label>
              <input
                type="text"
                value={formData.taxNumber}
                onChange={(e) => setFormData({ ...formData, taxNumber: e.target.value })}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all text-left dir-ltr"
                dir="ltr"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">رسوم التوصيل الافتراضية</label>
              <div className="relative">
                <input
                  type="number"
                  value={formData.deliveryFee}
                  onChange={(e) => setFormData({ ...formData, deliveryFee: Number(e.target.value) })}
                  className="w-full px-4 py-3 pl-12 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">ج.م</span>
              </div>
            </div>
          </div>
        </section>

        {/* Theme Selection */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <Palette className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">المظهر والألوان</h2>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {themes.map((theme) => (
              <button
                key={theme.id}
                onClick={() => setFormData({ ...formData, theme: theme.id })}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-3 ${
                  formData.theme === theme.id
                    ? "border-primary-500 bg-primary-50 shadow-md"
                    : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"
                }`}
              >
                <div className={`w-10 h-10 rounded-full shadow-inner ${theme.color} ${formData.theme === theme.id ? 'ring-4 ring-primary-200' : ''}`} />
                <span className={`font-bold ${formData.theme === theme.id ? 'text-primary-700' : 'text-gray-600'}`}>
                  {theme.name}
                </span>
              </button>
            ))}
          </div>
        </section>

        {/* Payment Methods */}
        <section className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
            <div className="p-3 bg-primary-50 text-primary-600 rounded-xl">
              <CreditCard className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">طرق الدفع المفعلة</h2>
          </div>
          
          <div className="space-y-4">
            {[
              { id: "cash", label: "الدفع النقدي (كاش)" },
              { id: "card", label: "البطاقات البنكية (فيزا / ماستركارد)" },
              { id: "receipt", label: "إيصال التحويل (إنستاباي / فودافون كاش)" },
            ].map((method) => (
              <label key={method.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors">
                <span className="font-bold text-gray-700">{method.label}</span>
                <div className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={formData.paymentMethods[method.id as keyof typeof formData.paymentMethods]}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        paymentMethods: { ...formData.paymentMethods, [method.id]: e.target.checked },
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] rtl:after:right-[2px] rtl:after:left-auto after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600 shadow-inner"></div>
                </div>
              </label>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
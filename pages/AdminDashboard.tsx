import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  };

  const adminTabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'users', name: 'إدارة المستخدمين', icon: '👥' },
    { id: 'content', name: 'إدارة المحتوى', icon: '📝' },
    { id: 'settings', name: 'إعدادات الموقع', icon: '⚙️' },
    { id: 'analytics', name: 'الإحصائيات', icon: '📈' },
    { id: 'security', name: 'الأمان', icon: '🔒' },
  ];

  const stats = [
    { title: 'إجمالي المستخدمين', value: '1,234', change: '+12%', icon: '👥', color: 'blue' },
    { title: 'الطلاب النشطين', value: '856', change: '+8%', icon: '🎓', color: 'green' },
    { title: 'المعلمين', value: '45', change: '+3%', icon: '👨‍🏫', color: 'purple' },
    { title: 'الزيارات اليوم', value: '2,456', change: '+15%', icon: '👁️', color: 'orange' },
  ];

  const recentUsers = [
    { name: 'أحمد محمد', type: 'طالب', email: 'ahmed@example.com', status: 'نشط', joinDate: '2024-01-15' },
    { name: 'فاطمة علي', type: 'معلم', email: 'fatima@example.com', status: 'نشط', joinDate: '2024-01-14' },
    { name: 'محمد حسن', type: 'طالب', email: 'mohamed@example.com', status: 'غير نشط', joinDate: '2024-01-13' },
    { name: 'سارة أحمد', type: 'معلم', email: 'sara@example.com', status: 'نشط', joinDate: '2024-01-12' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up" style={{animationDelay: `${index * 0.1}s`}}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                <p className="text-green-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className={`w-12 h-12 bg-${stat.color}-100 dark:bg-${stat.color}-900/20 rounded-full flex items-center justify-center`}>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* المستخدمين الجدد */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up animate-delay-400">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">المستخدمين الجدد</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">الاسم</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">النوع</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">البريد</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">الحالة</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">تاريخ الانضمام</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'طالب' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'نشط' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.joinDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">إدارة المستخدمين</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            إضافة مستخدم جديد
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 dark:text-blue-400">الطلاب</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">856</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 dark:text-green-400">المعلمين</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">45</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 dark:text-purple-400">المديرين</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">3</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">الاسم</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">النوع</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">البريد</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">الحالة</th>
                <th className="text-right py-3 px-4 text-gray-600 dark:text-gray-400">الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {recentUsers.map((user, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{user.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'طالب' 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'نشط' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                    }`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="text-blue-500 hover:text-blue-700 transition-colors duration-200">
                        تعديل
                      </button>
                      <button className="text-red-500 hover:text-red-700 transition-colors duration-200">
                        حذف
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📰</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">الأخبار</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة الأخبار والمقالات</p>
            </div>
          </div>
          <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            إدارة الأخبار
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up animate-delay-100">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎓</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">الأقسام</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة الأقسام التعليمية</p>
            </div>
          </div>
          <button className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300">
            إدارة الأقسام
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up animate-delay-200">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">👨‍🏫</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">المعلمين</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة بيانات المعلمين</p>
            </div>
          </div>
          <button className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition-colors duration-300">
            إدارة المعلمين
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up animate-delay-300">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">معرض الصور</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة صور الموقع</p>
            </div>
          </div>
          <button className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition-colors duration-300">
            إدارة الصور
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up animate-delay-400">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">الأنشطة</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة الأنشطة والفعاليات</p>
            </div>
          </div>
          <button className="w-full bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition-colors duration-300">
            إدارة الأنشطة
          </button>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift transition-all duration-300 animate-fade-in-up animate-delay-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">⚙️</span>
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">الخدمات</h3>
              <p className="text-gray-600 dark:text-gray-400">إدارة الخدمات الإلكترونية</p>
            </div>
          </div>
          <button className="w-full bg-indigo-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition-colors duration-300">
            إدارة الخدمات
          </button>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">إعدادات الموقع</h3>
        
        <div className="space-y-6">
          {/* الوضع المظلم */}
          <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div>
              <h4 className="font-bold text-gray-800 dark:text-gray-100">الوضع المظلم</h4>
              <p className="text-gray-600 dark:text-gray-400 text-sm">تفعيل أو إلغاء الوضع المظلم للموقع</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
                isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                  isDarkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* إعدادات الموقع */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  اسم الموقع
                </label>
                <input
                  type="text"
                  defaultValue="أكاديمية الشرق"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  rows={3}
                  defaultValue="مدرسة الاحايوه شرق - المرحلة الاعدادية"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  البريد الإلكتروني
                </label>
                <input
                  type="email"
                  defaultValue="info@alsharq-academia.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  defaultValue="+966 50 123 4567"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
              حفظ الإعدادات
            </button>
            <button className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300">
              إعادة تعيين
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">إحصائيات الزيارات</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الزيارات اليوم</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">2,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الزيارات هذا الأسبوع</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">15,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الزيارات هذا الشهر</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">45,678</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">إجمالي الزيارات</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">234,567</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up animate-delay-100">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">أكثر الصفحات زيارة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الصفحة الرئيسية</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الأقسام التعليمية</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">المعلمين</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">معرض الصور</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">14%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg animate-fade-in-up">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-6">إعدادات الأمان</h3>
        
        <div className="space-y-6">
          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center gap-3">
              <span className="text-green-500 text-xl">✅</span>
              <div>
                <h4 className="font-bold text-green-800 dark:text-green-400">حالة الأمان</h4>
                <p className="text-green-600 dark:text-green-300 text-sm">الموقع آمن ومحمي</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">إعدادات تسجيل الدخول</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">تفعيل المصادقة الثنائية</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">تسجيل محاولات تسجيل الدخول</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">حظر IP بعد محاولات فاشلة</span>
                </label>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="font-bold text-gray-800 dark:text-gray-100">إعدادات البيانات</h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">تشفير البيانات الحساسة</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" defaultChecked className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">نسخ احتياطي يومي</span>
                </label>
                <label className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <span className="text-gray-700 dark:text-gray-300">تسجيل جميع العمليات</span>
                </label>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300">
              حفظ إعدادات الأمان
            </button>
            <button className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300">
              إعادة تعيين كلمات المرور
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return renderContentManagement();
      case 'settings':
        return renderSettings();
      case 'analytics':
        return renderAnalytics();
      case 'security':
        return renderSecurity();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">👑</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">لوحة تحكم المسئول</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">مرحباً {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors duration-300"
                title={isDarkMode ? 'تفعيل الوضع العادي' : 'تفعيل الوضع المظلم'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300 flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-64">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4">
              <nav className="space-y-2">
                {adminTabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-right transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span className="font-medium">{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {renderMainContent()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

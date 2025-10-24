import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type UserType = 'student' | 'teacher' | 'parent' | 'admin';

interface User {
  id: string;
  name: string;
  email: string;
  userType: UserType;
}

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  // قراءة بيانات المستخدم من localStorage عند تحميل الصفحة
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser) as User);
      } catch (error) {
        console.error('Error parsing user data:', error);
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // لوحة تحكم الطالب
  const StudentDashboard = () => {
    const [activeTab, setActiveTab] = useState<'overview' | 'assignments' | 'lessons' | 'grades'>('overview');

    return (
      <div className="space-y-6">
        {/* الإحصائيات */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="text-3xl font-bold text-blue-600 mb-2">3.8</div>
            <p className="text-gray-600 dark:text-gray-400">المعدل الحالي</p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-3xl font-bold text-green-600 mb-2">12</div>
            <p className="text-gray-600 dark:text-gray-400">الحضور (يوم)</p>
          </div>
          <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
            <div className="text-3xl font-bold text-yellow-600 mb-2">5</div>
            <p className="text-gray-600 dark:text-gray-400">الواجبات المعلقة</p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
            <div className="text-3xl font-bold text-purple-600 mb-2">8</div>
            <p className="text-gray-600 dark:text-gray-400">الاختبارات</p>
          </div>
        </div>

        {/* التبويبات */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex-1 py-3 px-4 font-bold transition-colors ${
                activeTab === 'overview'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              نظرة عامة
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`flex-1 py-3 px-4 font-bold transition-colors ${
                activeTab === 'assignments'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              الواجبات
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 py-3 px-4 font-bold transition-colors ${
                activeTab === 'lessons'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              الدروس
            </button>
            <button
              onClick={() => setActiveTab('grades')}
              className={`flex-1 py-3 px-4 font-bold transition-colors ${
                activeTab === 'grades'
                  ? 'border-b-2 border-blue-600 text-blue-600'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              الدرجات
            </button>
          </div>

          <div className="p-6">
            {/* تبويب النظرة العامة */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الدروس القادمة</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">الرياضيات</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">غداً - 10:00 صباحاً</p>
                      </div>
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-sm">قريب</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                      <div>
                        <p className="font-bold text-gray-800 dark:text-gray-200">العلوم</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">بعد غد - 11:30 صباحاً</p>
                      </div>
                      <span className="bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm">قادم</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الإشعارات</h3>
                  <div className="space-y-3">
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 border-r-4 border-red-500 rounded">
                      <p className="font-bold text-red-700 dark:text-red-300">واجب جديد</p>
                      <p className="text-sm text-red-600 dark:text-red-400">تم إضافة واجب في الرياضيات</p>
                    </div>
                    <div className="p-3 bg-green-50 dark:bg-green-900/20 border-r-4 border-green-500 rounded">
                      <p className="font-bold text-green-700 dark:text-green-300">نتيجة اختبار</p>
                      <p className="text-sm text-green-600 dark:text-green-400">تم نشر نتيجة اختبار العلوم</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* تبويب الواجبات */}
            {activeTab === 'assignments' && (
              <div className="space-y-4">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">واجب الرياضيات</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">حل المسائل من 1 إلى 20 من الفصل الثالث</p>
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">📅 الموعد النهائي: 2024-10-20</p>
                  <div className="flex gap-2">
                    <label className="flex-1 bg-white dark:bg-gray-700 border-2 border-dashed border-blue-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-600 transition">
                      <input type="file" className="hidden" />
                      <p className="font-bold text-blue-600 dark:text-blue-400">📤 رفع الواجب</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">PDF أو صورة</p>
                    </label>
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">واجب العلوم</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">كتابة تقرير عن دورة الماء</p>
                  <p className="text-sm text-green-600 dark:text-green-400 mb-4">✅ تم التسليم في 2024-10-18</p>
                  <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded transition">
                    عرض التقييم
                  </button>
                </div>
              </div>
            )}

            {/* تبويب الدروس */}
            {activeTab === 'lessons' && (
              <div className="space-y-4">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">درس الرياضيات - المعادلات</h4>
                  <div className="flex gap-2 mb-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2">
                      ▶️ مشاهدة الفيديو
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2">
                      📥 تحميل الملاحظات
                    </button>
                  </div>
                  <label className="block bg-gray-50 dark:bg-gray-600 border-2 border-dashed border-gray-400 rounded-lg p-4 text-center cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-500 transition">
                    <input type="file" className="hidden" accept="video/*" />
                    <p className="font-bold text-gray-700 dark:text-gray-200">📹 رفع فيديو إضافي</p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">MP4, WebM أو AVI</p>
                  </label>
                </div>

                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 p-4 rounded-lg">
                  <h4 className="font-bold text-gray-800 dark:text-gray-100 mb-3">درس العلوم - الخلية</h4>
                  <div className="flex gap-2 mb-3">
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2">
                      ▶️ مشاهدة الفيديو
                    </button>
                    <button className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded transition flex items-center justify-center gap-2">
                      📥 تحميل الملاحظات
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* تبويب الدرجات */}
            {activeTab === 'grades' && (
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full text-right">
                    <thead className="bg-gray-100 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 py-2 font-bold text-gray-800 dark:text-gray-100">المادة</th>
                        <th className="px-4 py-2 font-bold text-gray-800 dark:text-gray-100">الاختبار الأول</th>
                        <th className="px-4 py-2 font-bold text-gray-800 dark:text-gray-100">الاختبار الثاني</th>
                        <th className="px-4 py-2 font-bold text-gray-800 dark:text-gray-100">المعدل</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">الرياضيات</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">85</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">90</td>
                        <td className="px-4 py-2 font-bold text-blue-600">87.5</td>
                      </tr>
                      <tr className="border-b border-gray-200 dark:border-gray-600">
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">العلوم</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">92</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">88</td>
                        <td className="px-4 py-2 font-bold text-green-600">90</td>
                      </tr>
                      <tr>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">اللغة العربية</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">80</td>
                        <td className="px-4 py-2 text-gray-800 dark:text-gray-200">85</td>
                        <td className="px-4 py-2 font-bold text-blue-600">82.5</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // لوحة تحكم المعلم
  const TeacherDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-3xl font-bold text-blue-600 mb-2">120</div>
          <p className="text-gray-600 dark:text-gray-400">عدد الطلاب</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 mb-2">15</div>
          <p className="text-gray-600 dark:text-gray-400">الفصول</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-3xl font-bold text-yellow-600 mb-2">8</div>
          <p className="text-gray-600 dark:text-gray-400">الواجبات المعلقة</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-3xl font-bold text-purple-600 mb-2">12</div>
          <p className="text-gray-600 dark:text-gray-400">الاختبارات</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الفصول الدراسية</h3>
          <div className="space-y-2">
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">الأول الإعدادي - أ</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">35 طالب</p>
            </button>
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">الأول الإعدادي - ب</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">32 طالب</p>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الإجراءات السريعة</h3>
          <div className="space-y-2">
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition">
              إضافة واجب جديد
            </button>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded transition">
              إنشاء اختبار
            </button>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 rounded transition">
              تقييم الطلاب
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // لوحة تحكم ولي الأمر
  const ParentDashboard = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">أطفالك</h3>
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="font-bold text-gray-800 dark:text-gray-200">محمد أحمد</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">الصف الأول الإعدادي - أ</p>
            <div className="mt-2 flex gap-2">
              <button className="text-sm bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">عرض التفاصيل</button>
              <button className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700">الدرجات</button>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الأداء الأكاديمي</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">الرياضيات</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">85%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm font-bold text-gray-700 dark:text-gray-300">العلوم</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">90%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div className="bg-green-600 h-2 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الحضور والغياب</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">الحضور</span>
              <span className="text-2xl font-bold text-green-600">95%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-700 dark:text-gray-300">الغياب</span>
              <span className="text-2xl font-bold text-red-600">5%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // لوحة تحكم الإدمن
  const AdminDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
          <div className="text-3xl font-bold text-blue-600 mb-2">450</div>
          <p className="text-gray-600 dark:text-gray-400">إجمالي الطلاب</p>
        </div>
        <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
          <div className="text-3xl font-bold text-green-600 mb-2">45</div>
          <p className="text-gray-600 dark:text-gray-400">المعلمون</p>
        </div>
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-800">
          <div className="text-3xl font-bold text-yellow-600 mb-2">150</div>
          <p className="text-gray-600 dark:text-gray-400">أولياء الأمور</p>
        </div>
        <div className="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <div className="text-3xl font-bold text-purple-600 mb-2">15</div>
          <p className="text-gray-600 dark:text-gray-400">الفصول</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">إدارة المستخدمين</h3>
          <div className="space-y-2">
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">إضافة طالب جديد</p>
            </button>
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">إضافة معلم جديد</p>
            </button>
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">إدارة الحسابات</p>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">الإعدادات</h3>
          <div className="space-y-2">
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">إدارة الفصول</p>
            </button>
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">إدارة المناهج</p>
            </button>
            <button className="w-full text-right p-3 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 transition">
              <p className="font-bold text-gray-800 dark:text-gray-200">التقارير</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // عرض رسالة تحميل أثناء جلب بيانات المستخدم
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400 font-bold">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">لوحة التحكم</h1>
            <p className="text-gray-600 dark:text-gray-400">مرحباً {user.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-bold text-gray-800 dark:text-gray-100">{user.name}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {user.userType === 'student' && 'طالب'}
                {user.userType === 'teacher' && 'معلم'}
                {user.userType === 'parent' && 'ولي أمر'}
                {user.userType === 'admin' && 'مسؤول'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded transition"
            >
              تسجيل الخروج
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {user.userType === 'student' && <StudentDashboard />}
        {user.userType === 'teacher' && <TeacherDashboard />}
        {user.userType === 'parent' && <ParentDashboard />}
        {user.userType === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
};

export default Dashboard;

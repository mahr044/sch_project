import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'teacher' | 'parent' | 'admin' | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setLoading(true);
      // محاكاة تأخير الخادم
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
        console.log('Login submitted:', { ...formData, userType });
        
        // حفظ بيانات المستخدم في localStorage
        const userData = {
          id: '1',
          name: 'أحمد محمد',
          email: formData.email,
          userType: userType,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        // التحويل إلى لوحة التحكم بعد ثانية
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      }, 1500);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 flex items-center justify-center">
        <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-red-600 mb-2">أكاديمية الشرق</h1>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">اختر نوع الحساب</h2>
            <p className="text-gray-600 dark:text-gray-400 mt-2">اختر الفئة التي تنتمي إليها</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => setUserType('student')}
              className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition text-right"
            >
              <div className="text-4xl mb-2">👨‍🎓</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">طالب</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">للطلاب الملتحقين</p>
            </button>

            <button
              onClick={() => setUserType('teacher')}
              className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition text-right"
            >
              <div className="text-4xl mb-2">👨‍🏫</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">معلم</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">للمعلمين والمدربين</p>
            </button>

            <button
              onClick={() => setUserType('parent')}
              className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition text-right"
            >
              <div className="text-4xl mb-2">👨‍👩‍👧</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">ولي أمر</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">لأولياء الأمور</p>
            </button>

            <button
              onClick={() => setUserType('admin')}
              className="p-6 border-2 border-gray-300 dark:border-gray-600 rounded-lg hover:border-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-right"
            >
              <div className="text-4xl mb-2">⚙️</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">مسؤول</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">لمسؤولي المدرسة</p>
            </button>
          </div>

          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            ليس لديك حساب؟{' '}
            <Link to="/register" className="text-red-600 hover:underline font-bold">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 flex items-center justify-center">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <button
            onClick={() => setUserType(null)}
            className="text-blue-600 hover:text-blue-700 font-bold mb-4"
          >
            ← العودة
          </button>
          <h1 className="text-3xl font-black text-red-600 mb-2">أكاديمية الشرق</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">تسجيل الدخول</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">رحباً بعودتك</p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300 text-center">
            ✅ تم تسجيل الدخول بنجاح! سيتم تحويلك قريباً...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني أو رقم الطالب
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              كلمة المرور
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 transition-all ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل كلمة المرور"
              disabled={loading}
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* تذكرني وكلمة المرور المنسية */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 accent-red-600"
                disabled={loading}
              />
              <label className="text-sm text-gray-700 dark:text-gray-300">تذكرني</label>
            </div>
            <a href="#" className="text-sm text-red-600 hover:underline font-bold">
              هل نسيت كلمة المرور؟
            </a>
          </div>

          {/* زر تسجيل الدخول */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-bold py-3 rounded-lg transition-all duration-300 text-white ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-red-600 hover:bg-red-700 active:scale-95'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                جاري التحقق...
              </span>
            ) : (
              'تسجيل الدخول'
            )}
          </button>
        </form>

        {/* خيارات بديلة */}
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">أو</span>
            </div>
          </div>

          <div className="mt-6 space-y-3">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">Google</span>
            </button>

            <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.67-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421-7.403h-.004a9.87 9.87 0 00-5.031 1.378c-3.055 2.289-3.795 6.233-1.976 9.038 1.819 2.804 5.061 3.514 8.313 3.514.5 0 .988-.023 1.465-.07 1.512-.213 2.913-.6 4.035-1.268 1.122-.668 1.941-1.574 2.354-2.567.413-.993.62-2.095.62-3.181 0-3.344-2.186-6.377-5.511-7.678-1.547-.649-3.291-.956-5.157-.956z"/>
              </svg>
              <span className="text-gray-700 dark:text-gray-300 font-medium">WhatsApp</span>
            </button>
          </div>
        </div>

        {/* رابط إنشاء حساب */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
          ليس لديك حساب؟{' '}
          <Link to="/register" className="text-red-600 hover:underline font-bold">
            إنشاء حساب جديد
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

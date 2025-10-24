import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserType } from '../src/context/AuthContext';

const VisitorLogin: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [selectedType, setSelectedType] = useState<UserType>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    studentId: '',
    teacherId: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  // معالجة تسجيل الدخول
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // محاكاة عملية تسجيل الدخول
      await new Promise(resolve => setTimeout(resolve, 1000));

      // إنشاء بيانات المستخدم
      const userData = {
        id: selectedType === 'student' ? formData.studentId : `user_${Date.now()}`,
        name: formData.name,
        email: formData.email,
        type: selectedType,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=ef4444&color=fff`,
      };

      // تسجيل الدخول
      login(userData);

      // التوجه للصفحة المناسبة
      if (selectedType === 'student') {
        navigate('/student-dashboard');
      } else if (selectedType === 'teacher') {
        navigate('/teacher-dashboard');
      } else if (selectedType === 'admin') {
        navigate('/admin-dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('حدث خطأ في تسجيل الدخول. يرجى المحاولة مرة أخرى.');
    } finally {
      setIsLoading(false);
    }
  };

  // تحديث بيانات النموذج
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-block bg-gradient-to-r from-red-500 to-pink-500 p-3 rounded-full mb-4 animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-2">تسجيل الدخول</h1>
          <p className="text-gray-600 dark:text-gray-400">مرحباً</p>
        </div>

        {/* Login Form */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 animate-scale-in">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* نوع المستخدم */}
            <div className="animate-fade-in-up animate-delay-100">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                نوع المستخدم
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { type: 'student', label: 'طالب', icon: '🎓', color: 'blue' },
                  { type: 'teacher', label: 'معلم', icon: '👨‍🏫', color: 'green' },
                  { type: 'admin', label: 'مسئول', icon: '👑', color: 'red' },
                ].map(({ type, label, icon, color }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setSelectedType(type as UserType)}
                    className={`p-4 rounded-xl border-2 transition-all duration-300 hover-lift ${
                      selectedType === type
                        ? `border-${color}-500 bg-${color}-50 dark:bg-${color}-900/20`
                        : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                    }`}
                  >
                    <div className="text-2xl mb-2">{icon}</div>
                    <div className="font-bold text-gray-800 dark:text-gray-200">{label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* الاسم */}
            <div className="animate-fade-in-up animate-delay-200">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                الاسم الكامل
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="أدخل اسمك الكامل"
              />
            </div>

            {/* البريد الإلكتروني */}
            <div className="animate-fade-in-up animate-delay-300">
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                البريد الإلكتروني
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                placeholder="example@email.com"
              />
            </div>

            {/* رقم الطالب - يظهر فقط للطلاب */}
            {selectedType === 'student' && (
              <div className="animate-fade-in-up animate-delay-400">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  رقم الطالب
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
                  placeholder="أدخل رقم الطالب"
                />
              </div>
            )}

            {/* زر تسجيل الدخول */}
            <div className={`animate-fade-in-up ${selectedType === 'student' ? 'animate-delay-500' : 'animate-delay-400'}`}>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 text-white font-bold py-4 px-6 rounded-xl hover:from-red-600 hover:to-pink-600 hover-lift transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    جاري تسجيل الدخول...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                    </svg>
                    تسجيل الدخول
                  </>
                )}
              </button>
            </div>
          </form>

          {/* العودة للصفحة الرئيسية */}
          <div className={`mt-6 text-center animate-fade-in-up ${selectedType === 'student' ? 'animate-delay-600' : 'animate-delay-500'}`}>
            <button
              onClick={() => navigate('/')}
              className="text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors duration-300 flex items-center justify-center gap-2 mx-auto"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>

        {/* معلومات إضافية */}
        <div className={`mt-6 text-center animate-fade-in-up ${selectedType === 'student' ? 'animate-delay-700' : 'animate-delay-600'}`}>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            هل تحتاج مساعدة؟ 
            <a href="#" className="text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-300">
              تواصل معنا
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VisitorLogin;

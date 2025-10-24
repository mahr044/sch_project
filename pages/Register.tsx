import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState<'student' | 'teacher' | 'parent' | null>(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    studentId: '',
    grade: '',
    subject: '', // للمعلمين
    qualification: '', // للمعلمين
    childName: '', // لأولياء الأمور
    childGrade: '', // لأولياء الأمور
    agreeTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'الاسم الكامل مطلوب';
    if (!formData.email.trim()) newErrors.email = 'البريد الإلكتروني مطلوب';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'البريد الإلكتروني غير صحيح';
    if (!formData.phone.trim()) newErrors.phone = 'رقم الهاتف مطلوب';
    if (!formData.password) newErrors.password = 'كلمة المرور مطلوبة';
    if (formData.password.length < 6) newErrors.password = 'كلمة المرور يجب أن تكون 6 أحرف على الأقل';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'كلمات المرور غير متطابقة';
    if (!formData.agreeTerms) newErrors.agreeTerms = 'يجب الموافقة على الشروط والأحكام';

    // التحقق من الحقول الخاصة بكل نوع مستخدم
    if (userType === 'student') {
      if (!formData.studentId.trim()) newErrors.studentId = 'رقم الطالب مطلوب';
      if (!formData.grade) newErrors.grade = 'الصف الدراسي مطلوب';
    }

    if (userType === 'teacher') {
      if (!formData.subject.trim()) newErrors.subject = 'المادة الدراسية مطلوبة';
      if (!formData.qualification.trim()) newErrors.qualification = 'المؤهل العلمي مطلوب';
    }

    if (userType === 'parent') {
      if (!formData.childName.trim()) newErrors.childName = 'اسم الطفل مطلوب';
      if (!formData.childGrade) newErrors.childGrade = 'صف الطفل الدراسي مطلوب';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setSubmitted(true);
      console.log('Form submitted:', { ...formData, userType });
      
      // حفظ بيانات المستخدم الجديد في localStorage
      const userData = {
        id: Math.random().toString(36).substr(2, 9),
        name: formData.fullName,
        email: formData.email,
        userType: userType,
      };
      localStorage.setItem('user', JSON.stringify(userData));
      
      // التحويل إلى لوحة التحكم بعد ثانية ونصف
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }
  };

  if (!userType) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4 flex items-center justify-center">
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">للطلاب الملتحقين بالمدرسة</p>
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
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">لأولياء الأمور والآباء</p>
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
            هل لديك حساب بالفعل؟{' '}
            <Link to="/login" className="text-red-600 hover:underline font-bold">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <button
            onClick={() => setUserType(null)}
            className="text-blue-600 hover:text-blue-700 font-bold mb-4"
          >
            ← العودة
          </button>
          <h1 className="text-3xl font-black text-red-600 mb-2">أكاديمية الشرق</h1>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">إنشاء حساب جديد</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userType === 'student' && 'حساب طالب'}
            {userType === 'teacher' && 'حساب معلم'}
            {userType === 'parent' && 'حساب ولي أمر'}
            {userType === 'admin' && 'حساب مسؤول'}
          </p>
        </div>

        {submitted && (
          <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 border border-green-400 dark:border-green-600 rounded-lg text-green-700 dark:text-green-300 text-center">
            ✅ تم إنشاء الحساب بنجاح! سيتم تحويلك قريباً...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم الكامل */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              الاسم الكامل
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل اسمك الكامل"
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="example@email.com"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          {/* رقم الهاتف */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              رقم الهاتف
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="966501234567"
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          {/* حقول خاصة بالطالب */}
          {userType === 'student' && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  رقم الطالب
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.studentId ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل رقم الطالب"
                />
                {errors.studentId && <p className="text-red-500 text-sm mt-1">{errors.studentId}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  الصف الدراسي
                </label>
                <select
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.grade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر الصف الدراسي</option>
                  <option value="first">الأول الإعدادي</option>
                  <option value="second">الثاني الإعدادي</option>
                  <option value="third">الثالث الإعدادي</option>
                </select>
                {errors.grade && <p className="text-red-500 text-sm mt-1">{errors.grade}</p>}
              </div>
            </>
          )}

          {/* حقول خاصة بالمعلم */}
          {userType === 'teacher' && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  المادة الدراسية
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.subject ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: الرياضيات، العلوم"
                />
                {errors.subject && <p className="text-red-500 text-sm mt-1">{errors.subject}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  المؤهل العلمي
                </label>
                <input
                  type="text"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.qualification ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="مثال: بكالوريوس تربية"
                />
                {errors.qualification && <p className="text-red-500 text-sm mt-1">{errors.qualification}</p>}
              </div>
            </>
          )}

          {/* حقول خاصة بولي الأمر */}
          {userType === 'parent' && (
            <>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  اسم الطفل
                </label>
                <input
                  type="text"
                  name="childName"
                  value={formData.childName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.childName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="أدخل اسم الطفل"
                />
                {errors.childName && <p className="text-red-500 text-sm mt-1">{errors.childName}</p>}
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                  صف الطفل الدراسي
                </label>
                <select
                  name="childGrade"
                  value={formData.childGrade}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                    errors.childGrade ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">اختر الصف الدراسي</option>
                  <option value="first">الأول الإعدادي</option>
                  <option value="second">الثاني الإعدادي</option>
                  <option value="third">الثالث الإعدادي</option>
                </select>
                {errors.childGrade && <p className="text-red-500 text-sm mt-1">{errors.childGrade}</p>}
              </div>
            </>
          )}

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
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أدخل كلمة المرور"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              تأكيد كلمة المرور
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 dark:bg-gray-700 dark:text-white dark:border-gray-600 ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="أعد إدخال كلمة المرور"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* الشروط والأحكام */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreeTerms"
              checked={formData.agreeTerms}
              onChange={handleChange}
              className="mt-1 w-4 h-4 accent-red-600"
            />
            <label className="text-sm text-gray-700 dark:text-gray-300">
              أوافق على <a href="#" className="text-red-600 hover:underline">الشروط والأحكام</a> و <a href="#" className="text-red-600 hover:underline">سياسة الخصوصية</a>
            </label>
          </div>
          {errors.agreeTerms && <p className="text-red-500 text-sm">{errors.agreeTerms}</p>}

          {/* زر الإرسال */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors duration-300 mt-6"
          >
            إنشاء حساب
          </button>
        </form>

        {/* رابط تسجيل الدخول */}
        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          هل لديك حساب بالفعل؟{' '}
          <Link to="/login" className="text-red-600 hover:underline font-bold">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

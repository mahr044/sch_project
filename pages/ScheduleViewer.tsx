import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ScheduleViewer: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'classes' | 'teachers'>('classes');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // بيانات وهمية للفصول
  const classes = [
    { id: 'class-1', name: 'الصف الأول الإعدادي أ', teacher: 'أحمد محمد', subject: 'الرياضيات' },
    { id: 'class-2', name: 'الصف الأول الإعدادي ب', teacher: 'فاطمة علي', subject: 'العلوم' },
    { id: 'class-3', name: 'الصف الثاني الإعدادي أ', teacher: 'محمد حسن', subject: 'اللغة العربية' },
    { id: 'class-4', name: 'الصف الثاني الإعدادي ب', teacher: 'سارة أحمد', subject: 'اللغة الإنجليزية' },
    { id: 'class-5', name: 'الصف الثالث الإعدادي أ', teacher: 'علي محمود', subject: 'التاريخ' },
    { id: 'class-6', name: 'الصف الثالث الإعدادي ب', teacher: 'نور الدين', subject: 'الجغرافيا' },
  ];

  // بيانات وهمية للمعلمين
  const teachers = [
    { id: 'teacher-1', name: 'أحمد محمد علي', subject: 'الرياضيات', classes: ['الصف الأول أ', 'الصف الثاني أ'] },
    { id: 'teacher-2', name: 'فاطمة علي حسن', subject: 'العلوم', classes: ['الصف الأول ب', 'الصف الثالث أ'] },
    { id: 'teacher-3', name: 'محمد حسن إبراهيم', subject: 'اللغة العربية', classes: ['الصف الثاني أ', 'الصف الثالث ب'] },
    { id: 'teacher-4', name: 'سارة أحمد محمود', subject: 'اللغة الإنجليزية', classes: ['الصف الأول أ', 'الصف الثاني ب'] },
    { id: 'teacher-5', name: 'علي محمود نور', subject: 'التاريخ', classes: ['الصف الثالث أ', 'الصف الأول ب'] },
    { id: 'teacher-6', name: 'نور الدين سعد', subject: 'الجغرافيا', classes: ['الصف الثاني أ', 'الصف الثالث ب'] },
  ];

  // تصفية البيانات حسب البحث
  const filteredClasses = classes.filter(cls =>
    cls.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.teacher.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cls.subject.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTeachers = teachers.filter(teacher =>
    teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    teacher.classes.some(cls => cls.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewSchedule = (type: 'classes' | 'teachers') => {
    setSelectedSchedule(type);
    setIsLoading(true);
    
    // إخفاء مؤشر التحميل بعد 2 ثانية
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">📅</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">جداول الحصص</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">عرض جداول الحصص للفصول والمعلمين</p>
              </div>
            </div>
            <button
              onClick={handleBackToHome}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              العودة للصفحة الرئيسية
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="inline-block bg-gradient-to-r from-blue-500 to-green-500 p-4 rounded-full mb-4 animate-bounce-in">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-100 mb-4">جداول الحصص</h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            يمكنك الاطلاع على جداول الحصص للفصول والمعلمين، أو البحث عن جدول محدد
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('classes')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'classes'
                  ? 'bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              📚 جداول الفصول
            </button>
            <button
              onClick={() => setActiveTab('teachers')}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeTab === 'teachers'
                  ? 'bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 shadow-md'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              👨‍🏫 جداول المعلمين
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-8 animate-fade-in-up animate-delay-100">
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={activeTab === 'classes' ? 'البحث في الفصول...' : 'البحث في المعلمين...'}
              className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all duration-300"
            />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Quick Access to PDF Files */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300 animate-fade-in-up animate-delay-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">📚</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">جداول الفصول</h3>
                <p className="text-gray-600 dark:text-gray-400">عرض جميع جداول الفصول</p>
              </div>
            </div>
            <button
              onClick={() => handleViewSchedule('classes')}
              className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              عرض ملف PDF
            </button>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300 animate-fade-in-up animate-delay-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                <span className="text-2xl">👨‍🏫</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">جداول المعلمين</h3>
                <p className="text-gray-600 dark:text-gray-400">عرض جميع جداول المعلمين</p>
              </div>
            </div>
            <button
              onClick={() => handleViewSchedule('teachers')}
              className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              عرض ملف PDF
            </button>
          </div>
        </div>

        {/* Content Based on Active Tab */}
        {activeTab === 'classes' ? (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
              جداول الفصول ({filteredClasses.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClasses.map((cls, index) => (
                <div
                  key={cls.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📚</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{cls.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">المعلم: {cls.teacher}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="inline-block bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 px-3 py-1 rounded-full text-sm font-medium">
                      {cls.subject}
                    </span>
                  </div>
                  <button
                    onClick={() => handleViewSchedule('classes')}
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                  >
                    عرض الجدول
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 text-center mb-6">
              جداول المعلمين ({filteredTeachers.length})
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <div
                  key={teacher.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">👨‍🏫</span>
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 dark:text-gray-100">{teacher.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">المادة: {teacher.subject}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">الفصول:</p>
                    <div className="flex flex-wrap gap-1">
                      {teacher.classes.map((cls, idx) => (
                        <span
                          key={idx}
                          className="inline-block bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 px-2 py-1 rounded text-xs"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    onClick={() => handleViewSchedule('teachers')}
                    className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                  >
                    عرض الجدول
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PDF Viewer Modal */}
        {selectedSchedule && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[95vh] overflow-hidden animate-scale-in">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-green-50 dark:from-gray-700 dark:to-gray-600">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">
                      {selectedSchedule === 'classes' ? '📚' : '👨‍🏫'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                      {selectedSchedule === 'classes' ? 'جداول الفصول' : 'جداول المعلمين'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      يمكنك استعراض الجدول أو تحميله للطباعة
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {/* Download Button */}
                  <button
                    onClick={() => {
                      const fileName = selectedSchedule === 'classes' ? 'فصول.pdf' : 'معلمين.pdf';
                      const link = document.createElement('a');
                      link.href = `/schedule/${fileName}`;
                      link.download = fileName;
                      link.click();
                    }}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    تحميل PDF
                  </button>
                  {/* Print Button */}
                  <button
                    onClick={() => {
                      const fileName = selectedSchedule === 'classes' ? 'فصول.pdf' : 'معلمين.pdf';
                      window.open(`/schedule/${fileName}`, '_blank');
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    طباعة
                  </button>
                  {/* Close Button */}
                  <button
                    onClick={() => setSelectedSchedule(null)}
                    className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors duration-300 shadow-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* PDF Content */}
              <div className="p-6 h-[calc(95vh-120px)]">
                <div className="relative w-full h-full bg-gray-100 dark:bg-gray-700 rounded-xl overflow-hidden shadow-inner">
                  <iframe
                    src={`/schedule/${selectedSchedule === 'classes' ? 'فصول.pdf' : 'معلمين.pdf'}`}
                    className="w-full h-full border-0 rounded-xl"
                    title={selectedSchedule === 'classes' ? 'جداول الفصول' : 'جداول المعلمين'}
                    style={{ minHeight: '600px' }}
                  />
                </div>
                
                {/* Loading indicator */}
                {isLoading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl z-10">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                      <p className="text-gray-600 dark:text-gray-400 font-medium">جاري تحميل الجدول...</p>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Footer */}
              <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    يمكنك استخدام أزرار التحميل والطباعة أعلاه
                  </div>
                  <div className="flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    آخر تحديث: {new Date().toLocaleDateString('ar-EG')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScheduleViewer;

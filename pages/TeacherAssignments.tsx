import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useAssignments, Assignment, AssignmentFile, AssignmentType } from '../src/context/AssignmentContext';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const TeacherAssignments: React.FC = () => {
  const { user, logout } = useAuth();
  const { addAssignment, getAssignmentsByTeacher, getSubmissionsByAssignment } = useAssignments();
  const navigate = useNavigate();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<AssignmentFile[]>([]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const teacherAssignments = getAssignmentsByTeacher(user?.id || '');

  const subjects = [
    'الرياضيات', 'العلوم', 'اللغة العربية', 'اللغة الإنجليزية',
    'التاريخ', 'الجغرافيا', 'التربية الإسلامية', 'التربية الفنية'
  ];

  const assignmentTypes: { value: AssignmentType; label: string; icon: string }[] = [
    { value: 'homework', label: 'واجب منزلي', icon: '📝' },
    { value: 'project', label: 'مشروع', icon: '📋' },
    { value: 'exam', label: 'امتحان', icon: '📊' },
    { value: 'quiz', label: 'اختبار قصير', icon: '❓' },
  ];

  const handleCreateAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const assignmentData = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as AssignmentType,
      subject: formData.get('subject') as string,
      teacherId: user?.id || '',
      teacherName: user?.name || '',
      dueDate: formData.get('dueDate') as string,
      maxGrade: parseInt(formData.get('maxGrade') as string),
      instructions: formData.get('instructions') as string,
      files: uploadedFiles,
    };

    addAssignment(assignmentData);
    setShowCreateForm(false);
    setUploadedFiles([]);
    (e.target as HTMLFormElement).reset();
  };

  const handleFilesSelected = (files: AssignmentFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const getStatusColor = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    if (diffDays <= 1) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-green-600 bg-green-100 dark:bg-green-900/20';
  };

  const getStatusText = (dueDate: string) => {
    const now = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'منتهي الصلاحية';
    if (diffDays === 0) return 'ينتهي اليوم';
    if (diffDays === 1) return 'ينتهي غداً';
    return `${diffDays} أيام متبقية`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">👨‍🏫</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">إدارة التكليفات</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">مرحباً أستاذ {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/teacher-dashboard')}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
              >
                العودة للوحة التحكم
              </button>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                تسجيل الخروج
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">التكليفات والواجبات</h2>
            <p className="text-gray-600 dark:text-gray-400">إدارة وتتبع تكليفات الطلاب</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            إنشاء تكليف جديد
          </button>
        </div>

        {/* Create Assignment Form */}
        {showCreateForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">إنشاء تكليف جديد</h3>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleCreateAssignment} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        عنوان التكليف
                      </label>
                      <input
                        type="text"
                        name="title"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="أدخل عنوان التكليف"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        المادة الدراسية
                      </label>
                      <select
                        name="subject"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">اختر المادة</option>
                        {subjects.map(subject => (
                          <option key={subject} value={subject}>{subject}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        نوع التكليف
                      </label>
                      <select
                        name="type"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      >
                        <option value="">اختر النوع</option>
                        {assignmentTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.icon} {type.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        تاريخ الاستحقاق
                      </label>
                      <input
                        type="datetime-local"
                        name="dueDate"
                        required
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        الدرجة العظمى
                      </label>
                      <input
                        type="number"
                        name="maxGrade"
                        required
                        min="1"
                        max="100"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="100"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      وصف التكليف
                    </label>
                    <textarea
                      name="description"
                      required
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="أدخل وصف مفصل للتكليف"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      تعليمات إضافية
                    </label>
                    <textarea
                      name="instructions"
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="أي تعليمات إضافية للطلاب (اختياري)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      الملفات المرفقة
                    </label>
                    <FileUpload
                      onFilesSelected={handleFilesSelected}
                      existingFiles={uploadedFiles}
                      onFileRemove={handleFileRemove}
                      maxFiles={5}
                      maxSize={10}
                    />
                  </div>

                  <div className="flex gap-4">
                    <button
                      type="submit"
                      className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      إنشاء التكليف
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCreateForm(false)}
                      className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
                    >
                      إلغاء
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Assignments List */}
        <div className="space-y-6">
          {teacherAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">لا توجد تكليفات بعد</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">ابدأ بإنشاء تكليف جديد لطلابك</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors duration-300"
              >
                إنشاء أول تكليف
              </button>
            </div>
          ) : (
            teacherAssignments.map((assignment) => {
              const submissions = getSubmissionsByAssignment(assignment.id);
              const typeInfo = assignmentTypes.find(t => t.value === assignment.type);
              
              return (
                <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{typeInfo?.icon}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                          {assignment.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>{typeInfo?.label}</span>
                          <span>•</span>
                          <span>الدرجة العظمى: {assignment.maxGrade}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment.dueDate)}`}>
                        {getStatusText(assignment.dueDate)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {new Date(assignment.dueDate).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 mb-4">{assignment.description}</p>

                  {assignment.instructions && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                      <h4 className="font-medium text-blue-800 dark:text-blue-400 mb-2">تعليمات إضافية:</h4>
                      <p className="text-blue-700 dark:text-blue-300">{assignment.instructions}</p>
                    </div>
                  )}

                  {assignment.files.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">الملفات المرفقة:</h4>
                      <div className="flex flex-wrap gap-2">
                        {assignment.files.map((file) => (
                          <a
                            key={file.id}
                            href={file.url}
                            download={file.name}
                            className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                          >
                            <span>📎</span>
                            <span>{file.name}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>التسليمات: {submissions.length}</span>
                      <span>•</span>
                      <span>أنشئ في: {new Date(assignment.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAssignment(assignment)}
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 text-sm"
                      >
                        عرض التسليمات
                      </button>
                      <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 text-sm">
                        تعديل
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default TeacherAssignments;

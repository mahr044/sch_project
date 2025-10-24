import React, { useState } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useAssignments, Assignment, AssignmentSubmission, AssignmentFile } from '../src/context/AssignmentContext';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../components/FileUpload';

const StudentAssignments: React.FC = () => {
  const { user, logout } = useAssignments();
  const { user: authUser, logout: authLogout } = useAuth();
  const { 
    getAssignmentsByStudent, 
    getSubmissionByStudent, 
    submitAssignment,
    assignments 
  } = useAssignments();
  const navigate = useNavigate();
  
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<AssignmentFile[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');

  const handleLogout = () => {
    authLogout();
    navigate('/');
  };

  const studentAssignments = getAssignmentsByStudent(authUser?.id || '');

  const getAssignmentTypeIcon = (type: string): string => {
    switch (type) {
      case 'homework': return '📝';
      case 'project': return '📋';
      case 'exam': return '📊';
      case 'quiz': return '❓';
      default: return '📄';
    }
  };

  const getAssignmentTypeLabel = (type: string): string => {
    switch (type) {
      case 'homework': return 'واجب منزلي';
      case 'project': return 'مشروع';
      case 'exam': return 'امتحان';
      case 'quiz': return 'اختبار قصير';
      default: return 'تكليف';
    }
  };

  const getStatusColor = (assignment: Assignment, submission?: AssignmentSubmission) => {
    if (submission?.status === 'graded') {
      return 'text-green-600 bg-green-100 dark:bg-green-900/20';
    }
    if (submission?.status === 'submitted') {
      return 'text-blue-600 bg-blue-100 dark:bg-blue-900/20';
    }
    if (submission?.status === 'late') {
      return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    }
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'text-red-600 bg-red-100 dark:bg-red-900/20';
    if (diffDays <= 1) return 'text-orange-600 bg-orange-100 dark:bg-orange-900/20';
    return 'text-gray-600 bg-gray-100 dark:bg-gray-900/20';
  };

  const getStatusText = (assignment: Assignment, submission?: AssignmentSubmission) => {
    if (submission?.status === 'graded') {
      return `تم التقييم (${submission.grade}/${assignment.maxGrade})`;
    }
    if (submission?.status === 'submitted') {
      return 'تم التسليم';
    }
    if (submission?.status === 'late') {
      return 'تسليم متأخر';
    }
    
    const now = new Date();
    const due = new Date(assignment.dueDate);
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return 'منتهي الصلاحية';
    if (diffDays === 0) return 'ينتهي اليوم';
    if (diffDays === 1) return 'ينتهي غداً';
    return `${diffDays} أيام متبقية`;
  };

  const filteredAssignments = studentAssignments.filter(assignment => {
    const submission = getSubmissionByStudent(assignment.id, authUser?.id || '');
    
    switch (filter) {
      case 'pending':
        return !submission;
      case 'submitted':
        return submission?.status === 'submitted' || submission?.status === 'late';
      case 'graded':
        return submission?.status === 'graded';
      default:
        return true;
    }
  });

  const handleSubmitAssignment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!selectedAssignment || uploadedFiles.length === 0) {
      alert('يرجى رفع ملف واحد على الأقل');
      return;
    }

    const submissionData = {
      assignmentId: selectedAssignment.id,
      studentId: authUser?.id || '',
      studentName: authUser?.name || '',
      files: uploadedFiles,
    };

    submitAssignment(submissionData);
    setShowSubmitForm(false);
    setSelectedAssignment(null);
    setUploadedFiles([]);
  };

  const handleFilesSelected = (files: AssignmentFile[]) => {
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const handleFileRemove = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== fileId));
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">🎓</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">الواجبات والتكليفات</h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">مرحباً {authUser?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/student-dashboard')}
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
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">واجباتي</h2>
            <p className="text-gray-600 dark:text-gray-400">عرض وتحميل الواجبات والتكليفات</p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { value: 'all', label: 'الكل', count: studentAssignments.length },
            { value: 'pending', label: 'معلق', count: studentAssignments.filter(a => !getSubmissionByStudent(a.id, authUser?.id || '')).length },
            { value: 'submitted', label: 'مسلم', count: studentAssignments.filter(a => {
              const s = getSubmissionByStudent(a.id, authUser?.id || '');
              return s?.status === 'submitted' || s?.status === 'late';
            }).length },
            { value: 'graded', label: 'مقيم', count: studentAssignments.filter(a => getSubmissionByStudent(a.id, authUser?.id || '')?.status === 'graded').length },
          ].map(({ value, label, count }) => (
            <button
              key={value}
              onClick={() => setFilter(value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors duration-300 ${
                filter === value
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
              }`}
            >
              {label} ({count})
            </button>
          ))}
        </div>

        {/* Assignments List */}
        <div className="space-y-6">
          {filteredAssignments.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📚</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {filter === 'all' ? 'لا توجد واجبات' : 'لا توجد واجبات في هذا التصنيف'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === 'all' ? 'لم يتم تعيين أي واجبات بعد' : 'جرب تصنيف آخر'}
              </p>
            </div>
          ) : (
            filteredAssignments.map((assignment) => {
              const submission = getSubmissionByStudent(assignment.id, authUser?.id || '');
              
              return (
                <div key={assignment.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 hover-lift transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-4">
                      <div className="text-3xl">{getAssignmentTypeIcon(assignment.type)}</div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-1">
                          {assignment.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                          <span>{assignment.subject}</span>
                          <span>•</span>
                          <span>{getAssignmentTypeLabel(assignment.type)}</span>
                          <span>•</span>
                          <span>الدرجة العظمى: {assignment.maxGrade}</span>
                          <span>•</span>
                          <span>المعلم: {assignment.teacherName}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-left">
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(assignment, submission)}`}>
                        {getStatusText(assignment, submission)}
                      </div>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        ينتهي: {new Date(assignment.dueDate).toLocaleDateString('ar-SA')}
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
                            <span className="text-xs text-gray-500">({formatFileSize(file.size)})</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {submission && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">تسليمك:</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            تم التسليم في: {new Date(submission.submittedAt).toLocaleDateString('ar-SA')}
                          </span>
                          {submission.grade && (
                            <span className="font-bold text-green-600 dark:text-green-400">
                              الدرجة: {submission.grade}/{assignment.maxGrade}
                            </span>
                          )}
                        </div>
                        
                        {submission.files.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {submission.files.map((file) => (
                              <a
                                key={file.id}
                                href={file.url}
                                download={file.name}
                                className="flex items-center gap-2 px-3 py-1 bg-blue-100 dark:bg-blue-900/20 rounded-lg text-sm hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors duration-200"
                              >
                                <span>📎</span>
                                <span>{file.name}</span>
                              </a>
                            ))}
                          </div>
                        )}
                        
                        {submission.feedback && (
                          <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <h5 className="font-medium text-yellow-800 dark:text-yellow-400 mb-1">تعليق المعلم:</h5>
                            <p className="text-yellow-700 dark:text-yellow-300">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      أنشئ في: {new Date(assignment.createdAt).toLocaleDateString('ar-SA')}
                    </div>
                    
                    <div className="flex gap-2">
                      {!submission ? (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmitForm(true);
                          }}
                          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300"
                        >
                          تسليم الواجب
                        </button>
                      ) : submission.status === 'graded' ? (
                        <button
                          onClick={() => {
                            setSelectedAssignment(assignment);
                            setShowSubmitForm(true);
                          }}
                          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
                        >
                          عرض التفاصيل
                        </button>
                      ) : (
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          تم التسليم - في انتظار التقييم
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Submit Assignment Form */}
        {showSubmitForm && selectedAssignment && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">
                    تسليم الواجب: {selectedAssignment.title}
                  </h3>
                  <button
                    onClick={() => {
                      setShowSubmitForm(false);
                      setSelectedAssignment(null);
                      setUploadedFiles([]);
                    }}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <h4 className="font-medium text-gray-800 dark:text-gray-100 mb-2">تفاصيل الواجب:</h4>
                  <p className="text-gray-700 dark:text-gray-300 mb-2">{selectedAssignment.description}</p>
                  {selectedAssignment.instructions && (
                    <div className="mt-2">
                      <h5 className="font-medium text-blue-800 dark:text-blue-400 mb-1">تعليمات إضافية:</h5>
                      <p className="text-blue-700 dark:text-blue-300">{selectedAssignment.instructions}</p>
                    </div>
                  )}
                </div>

                <form onSubmit={handleSubmitAssignment} className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      رفع ملفات الواجب
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
                      disabled={uploadedFiles.length === 0}
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      تسليم الواجب
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowSubmitForm(false);
                        setSelectedAssignment(null);
                        setUploadedFiles([]);
                      }}
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
      </div>
    </div>
  );
};

export default StudentAssignments;

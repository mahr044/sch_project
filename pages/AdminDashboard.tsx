import React, { useState, useEffect } from 'react';
import { useAuth } from '../src/context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { SliderManager } from '../components/SliderManager';
import { NewsManager } from '../components/NewsManager';

interface SiteSettings {
  siteName: string;
  siteDescription: string;
  email: string;
  phone: string;
}

interface UserData {
  id: string;
  name: string;
  type: string;
  email: string;
  status: string;
  joinDate: string;
}

interface ScheduleFile {
  id: string;
  name: string;
  uploadDate: string;
  type: string;
}

interface VideoFile {
  id: string;
  name: string;
  uploadDate: string;
  duration: string;
}

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark');
  });

  // Site Settings State
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : {
      siteName: 'مدرسة الاحايوه شرق',
      siteDescription: 'مدرسة الاحايوه شرق - المرحلة الاعدادية',
      email: 'info@alsharq-academia.com',
      phone: '+966 50 123 4567'
    };
  });

  // User Management State
  const [users, setUsers] = useState<UserData[]>([
    { id: '1', name: 'أحمد محمد', type: 'طالب', email: 'ahmed@example.com', status: 'نشط', joinDate: '2024-01-15' },
    { id: '2', name: 'فاطمة علي', type: 'معلم', email: 'fatima@example.com', status: 'نشط', joinDate: '2024-01-14' },
    { id: '3', name: 'محمد حسن', type: 'طالب', email: 'mohamed@example.com', status: 'موقوف', joinDate: '2024-01-13' },
    { id: '4', name: 'سارة أحمد', type: 'معلم', email: 'sara@example.com', status: 'نشط', joinDate: '2024-01-12' },
  ]);

  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState<'delete' | 'suspend' | null>(null);

  // Content Management State
  const [schedules, setSchedules] = useState<ScheduleFile[]>([
    { id: '1', name: 'جدول الصف الأول.pdf', uploadDate: '2024-01-20', type: 'حالي' },
    { id: '2', name: 'جدول الصف الثاني.pdf', uploadDate: '2024-01-20', type: 'حالي' },
  ]);

  const [archivedSchedules, setArchivedSchedules] = useState<ScheduleFile[]>([
    { id: 'a1', name: 'جدول الصف الأول القديم.pdf', uploadDate: '2023-12-15', type: 'أرشيف' },
  ]);

  const [videos, setVideos] = useState<VideoFile[]>([
    { id: '1', name: 'شرح الدرس الأول.mp4', uploadDate: '2024-01-18', duration: '15:30' },
    { id: '2', name: 'مراجعة الوحدة الأولى.mp4', uploadDate: '2024-01-17', duration: '22:45' },
  ]);

  const handleLogout = () => {
    navigate('/');
    setTimeout(() => {
      logout();
    }, 100);
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

  // Save settings to localStorage
  const handleSaveSettings = () => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
    alert('تم حفظ الإعدادات بنجاح!');
  };

  // User Management Functions
  const handleEditUser = (userData: UserData) => {
    const newName = prompt('أدخل الاسم الجديد:', userData.name);
    if (newName) {
      setUsers(users.map(u => u.id === userData.id ? { ...u, name: newName } : u));
    }
  };

  const handleSuspendUser = (userData: UserData) => {
    setSelectedUser(userData);
    setConfirmAction('suspend');
    setShowConfirmModal(true);
  };

  const handleDeleteUser = (userData: UserData) => {
    setSelectedUser(userData);
    setConfirmAction('delete');
    setShowConfirmModal(true);
  };

  const confirmUserAction = () => {
    if (!selectedUser) return;

    if (confirmAction === 'delete') {
      setUsers(users.filter(u => u.id !== selectedUser.id));
    } else if (confirmAction === 'suspend') {
      setUsers(users.map(u =>
        u.id === selectedUser.id
          ? { ...u, status: u.status === 'نشط' ? 'موقوف' : 'نشط' }
          : u
      ));
    }

    setShowConfirmModal(false);
    setSelectedUser(null);
    setConfirmAction(null);
  };

  // Content Management Functions
  const handleUploadSchedule = () => {
    const fileName = prompt('أدخل اسم ملف الجدول (مثال: جدول الصف الثالث.pdf):');
    if (fileName) {
      const newSchedule: ScheduleFile = {
        id: Date.now().toString(),
        name: fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        type: 'حالي'
      };
      setSchedules([...schedules, newSchedule]);
      alert('تم رفع الجدول بنجاح! (في التطبيق الفعلي، سيتم رفع الملف إلى public/schedule)');
    }
  };

  const handleArchiveSchedule = (scheduleId: string) => {
    const schedule = schedules.find(s => s.id === scheduleId);
    if (schedule) {
      setArchivedSchedules([...archivedSchedules, { ...schedule, type: 'أرشيف' }]);
      setSchedules(schedules.filter(s => s.id !== scheduleId));
      alert('تم أرشفة الجدول بنجاح!');
    }
  };

  const handleDeleteSchedule = (scheduleId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الجدول؟')) {
      setSchedules(schedules.filter(s => s.id !== scheduleId));
    }
  };

  const handleUploadVideo = () => {
    const fileName = prompt('أدخل اسم ملف الفيديو (مثال: شرح الدرس الثاني.mp4):');
    if (fileName) {
      const newVideo: VideoFile = {
        id: Date.now().toString(),
        name: fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        duration: '00:00'
      };
      setVideos([...videos, newVideo]);
      alert('تم رفع الفيديو بنجاح! (في التطبيق الفعلي، سيتم رفع الملف إلى public/videos)');
    }
  };

  const handleDeleteVideo = (videoId: string) => {
    if (confirm('هل أنت متأكد من حذف هذا الفيديو؟')) {
      setVideos(videos.filter(v => v.id !== videoId));
    }
  };

  const adminTabs = [
    { id: 'overview', name: 'نظرة عامة', icon: '📊' },
    { id: 'users', name: 'إدارة المستخدمين', icon: '👥' },
    { id: 'content', name: 'إدارة المحتوى', icon: '📝' },
    { id: 'slider', name: 'إدارة السلايدر', icon: '🖼️' },
    { id: 'news', name: 'إدارة الأخبار', icon: '📰' },
    { id: 'schedules', name: 'إدارة الجداول', icon: '📅' },
    { id: 'videos', name: 'إدارة الفيديوهات', icon: '🎥' },
    { id: 'settings', name: 'إعدادات الموقع', icon: '⚙️' },
    { id: 'analytics', name: 'الإحصائيات', icon: '📈' },
    { id: 'security', name: 'الأمان', icon: '🔒' },
  ];

  const stats = [
    { title: 'إجمالي المستخدمين', value: users.length.toString(), change: '+12%', icon: '👥', color: 'blue' },
    { title: 'الطلاب النشطين', value: users.filter(u => u.type === 'طالب' && u.status === 'نشط').length.toString(), change: '+8%', icon: '🎓', color: 'green' },
    { title: 'الجداول المرفوعة', value: schedules.length.toString(), change: '+5%', icon: '📅', color: 'purple' },
    { title: 'الفيديوهات', value: videos.length.toString(), change: '+15%', icon: '🎥', color: 'orange' },
  ];

  const renderOverview = () => (
    <div className="space-y-6">
      {/* الإحصائيات السريعة */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-1">{stat.value}</p>
                <p className="text-green-500 text-sm mt-1">{stat.change}</p>
              </div>
              <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* المستخدمين الجدد */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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
              {users.slice(0, 4).map((userData, index) => (
                <tr key={index} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{userData.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userData.type === 'طالب'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {userData.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{userData.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userData.status === 'نشط'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {userData.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{userData.joinDate}</td>
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
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">إدارة المستخدمين</h3>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
            إضافة مستخدم جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-blue-800 dark:text-blue-400">الطلاب</h4>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-300">
              {users.filter(u => u.type === 'طالب').length}
            </p>
          </div>
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-green-800 dark:text-green-400">المعلمين</h4>
            <p className="text-2xl font-bold text-green-600 dark:text-green-300">
              {users.filter(u => u.type === 'معلم').length}
            </p>
          </div>
          <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
            <h4 className="font-bold text-purple-800 dark:text-purple-400">الموقوفين</h4>
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-300">
              {users.filter(u => u.status === 'موقوف').length}
            </p>
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
              {users.map((userData) => (
                <tr key={userData.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                  <td className="py-3 px-4 text-gray-800 dark:text-gray-200">{userData.name}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userData.type === 'طالب'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                      }`}>
                      {userData.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">{userData.email}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${userData.status === 'نشط'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                        : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                      }`}>
                      {userData.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditUser(userData)}
                        className="text-blue-500 hover:text-blue-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                      >
                        ✏️ تعديل
                      </button>
                      <button
                        onClick={() => handleSuspendUser(userData)}
                        className="text-orange-500 hover:text-orange-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                      >
                        {userData.status === 'نشط' ? '⏸️ إيقاف' : '▶️ تفعيل'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(userData)}
                        className="text-red-500 hover:text-red-700 transition-colors duration-200 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                      >
                        🗑️ حذف
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

  const renderSchedules = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">إدارة الجداول الدراسية</h3>
          <button
            onClick={handleUploadSchedule}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            <span>📤</span>
            رفع جدول جديد
          </button>
        </div>

        <div className="mb-6">
          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">الجداول الحالية</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {schedules.map((schedule) => (
              <div key={schedule.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📄</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{schedule.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الرفع: {schedule.uploadDate}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleArchiveSchedule(schedule.id)}
                    className="text-orange-500 hover:text-orange-700 px-2 py-1 rounded hover:bg-orange-50 dark:hover:bg-orange-900/20"
                    title="أرشفة"
                  >
                    📦
                  </button>
                  <button
                    onClick={() => handleDeleteSchedule(schedule.id)}
                    className="text-red-500 hover:text-red-700 px-2 py-1 rounded hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="حذف"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-bold text-gray-700 dark:text-gray-300 mb-3">الجداول المؤرشفة</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {archivedSchedules.map((schedule) => (
              <div key={schedule.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg flex items-center justify-between opacity-75">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">📦</span>
                  <div>
                    <p className="font-medium text-gray-800 dark:text-gray-200">{schedule.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">تاريخ الأرشفة: {schedule.uploadDate}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderVideos = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100">إدارة الفيديوهات التعليمية</h3>
          <button
            onClick={handleUploadVideo}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300 flex items-center gap-2"
          >
            <span>🎥</span>
            رفع فيديو جديد
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((video) => (
            <div key={video.id} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
              <div className="flex items-center justify-center bg-gray-200 dark:bg-gray-600 rounded-lg h-32 mb-3">
                <span className="text-5xl">🎬</span>
              </div>
              <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">{video.name}</h4>
              <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
                <span>📅 {video.uploadDate}</span>
                <span>⏱️ {video.duration}</span>
              </div>
              <button
                onClick={() => handleDeleteVideo(video.id)}
                className="w-full bg-red-500 text-white px-3 py-2 rounded-lg hover:bg-red-600 transition-colors duration-300"
              >
                🗑️ حذف الفيديو
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${isDarkMode ? 'bg-blue-600' : 'bg-gray-300'
                }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${isDarkMode ? 'translate-x-6' : 'translate-x-1'
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
                  value={siteSettings.siteName}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  وصف الموقع
                </label>
                <textarea
                  rows={3}
                  value={siteSettings.siteDescription}
                  onChange={(e) => setSiteSettings({ ...siteSettings, siteDescription: e.target.value })}
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
                  value={siteSettings.email}
                  onChange={(e) => setSiteSettings({ ...siteSettings, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  رقم الهاتف
                </label>
                <input
                  type="tel"
                  value={siteSettings.phone}
                  onChange={(e) => setSiteSettings({ ...siteSettings, phone: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={handleSaveSettings}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300"
            >
              💾 حفظ الإعدادات
            </button>
            <button
              onClick={() => {
                setSiteSettings({
                  siteName: 'مدرسة الاحايوه شرق',
                  siteDescription: 'مدرسة الاحايوه شرق - المرحلة الاعدادية',
                  email: 'info@alsharq-academia.com',
                  phone: '+966 50 123 4567'
                });
              }}
              className="bg-gray-500 text-white px-6 py-2 rounded-lg hover:bg-gray-600 transition-colors duration-300"
            >
              🔄 إعادة تعيين
            </button>
          </div>
        </div>
      </div>

      {/* System Updates Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">تحديثات النظام</h3>
        <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg mb-4">
          <div className="flex items-center gap-3">
            <span className="text-green-500 text-2xl">✅</span>
            <div>
              <h4 className="font-bold text-green-800 dark:text-green-400">النظام محدث</h4>
              <p className="text-green-600 dark:text-green-300 text-sm">الإصدار الحالي: v2.0.0</p>
            </div>
          </div>
        </div>
        <button className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors duration-300">
          🔍 التحقق من التحديثات
        </button>
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">نمو المستخدمين</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">مستخدمين جدد اليوم</span>
              <span className="font-bold text-green-600 dark:text-green-400">+12</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">مستخدمين جدد هذا الأسبوع</span>
              <span className="font-bold text-green-600 dark:text-green-400">+87</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">مستخدمين جدد هذا الشهر</span>
              <span className="font-bold text-green-600 dark:text-green-400">+234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">معدل النمو</span>
              <span className="font-bold text-green-600 dark:text-green-400">+15.3%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">تفاعل المحتوى</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الجداول المشاهدة</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">1,234</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الفيديوهات المشاهدة</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">3,456</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">متوسط وقت المشاهدة</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">12:34</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">معدل التفاعل</span>
              <span className="font-bold text-green-600 dark:text-green-400">78.5%</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
          <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">أكثر الصفحات زيارة</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الصفحة الرئيسية</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">45%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">لوحة الطالب</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">23%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الجداول الدراسية</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">18%</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 dark:text-gray-400">الفيديوهات التعليمية</span>
              <span className="font-bold text-gray-800 dark:text-gray-100">14%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm">
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

  const renderContentManagement = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
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

  const renderMainContent = () => {
    switch (activeTab) {
      case 'overview':
        return renderOverview();
      case 'users':
        return renderUsers();
      case 'content':
        return renderContentManagement();
      case 'slider':
        return <SliderManager />;
      case 'news':
        return <NewsManager />;
      case 'schedules':
        return renderSchedules();
      case 'videos':
        return renderVideos();
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900 font-sans overflow-hidden" dir="rtl">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 mb-4">
              {confirmAction === 'delete' ? 'تأكيد الحذف' : 'تأكيد الإيقاف'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {confirmAction === 'delete'
                ? `هل أنت متأكد من حذف المستخدم "${selectedUser?.name}"؟ هذا الإجراء لا يمكن التراجع عنه.`
                : `هل أنت متأكد من ${selectedUser?.status === 'نشط' ? 'إيقاف' : 'تفعيل'} المستخدم "${selectedUser?.name}"؟`
              }
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmUserAction}
                className={`flex-1 ${confirmAction === 'delete' ? 'bg-red-500 hover:bg-red-600' : 'bg-orange-500 hover:bg-orange-600'
                  } text-white px-4 py-2 rounded-lg transition-colors duration-300`}
              >
                تأكيد
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setSelectedUser(null);
                  setConfirmAction(null);
                }}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-300"
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-lg flex flex-col z-20">
        <div className="p-6 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">👑</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-gray-100">لوحة التحكم</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">أكاديمية الشرق</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {adminTabs.map((tab) => (
              <li key={tab.id}>
                <button
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-right transition-all duration-200 ${activeTab === tab.id
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50'
                    }`}
                >
                  <span className="text-xl">{tab.icon}</span>
                  <span className="font-medium">{tab.name}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-sm">👤</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-gray-800 dark:text-gray-100 truncate">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors duration-200 text-sm font-medium"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 bg-gray-50 dark:bg-gray-900">
        {/* Top Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm z-10">
          <div className="px-6 py-4 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">
              {adminTabs.find(t => t.id === activeTab)?.name}
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
                title={isDarkMode ? 'تفعيل الوضع العادي' : 'تفعيل الوضع المظلم'}
              >
                {isDarkMode ? '☀️' : '🌙'}
              </button>
              <div className="relative">
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
                <button className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                  🔔
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <div className="max-w-7xl mx-auto">
            {renderMainContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;

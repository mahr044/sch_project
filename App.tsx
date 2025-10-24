import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './src/context/AuthContext';
import { AssignmentProvider } from './src/context/AssignmentContext';
import Header from './components/Header';
import Hero from './components/Hero';
import NewsAndEvents from './components/NewsAndEvents';
import Departments from './components/Departments';
import Services from './components/Services';
import PhotoGallery from './components/PhotoGallery';
import TutorsSwiper from './components/TutorsSwiper';
import Testimonials from './components/Testimonials';
import About from './components/About';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WhatsAppWidget from './components/WhatsAppWidget';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VisitorLogin from './pages/VisitorLogin';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import AdminDashboard from './pages/AdminDashboard';
import TeacherAssignments from './pages/TeacherAssignments';
import StudentAssignments from './pages/StudentAssignments';
import ScheduleViewer from './pages/ScheduleViewer';
import NotFound from './components/NotFoundEnhanced';

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('darkMode');
      return savedMode === 'true' || 
             (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
    }
    return false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('darkMode', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('darkMode', 'false');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  };

  return (
    <AuthProvider>
      <AssignmentProvider>
        <Router>
        <div className="bg-[#F8F4F0] dark:bg-gray-900 transition-colors duration-300">
          <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
          <Routes>
            <Route
              path="/"
              element={
                <main>
                  <Hero />
                  <About />
                  <NewsAndEvents />
                  <Departments />
                  <Services />
                  <PhotoGallery />
                  <TutorsSwiper />
                  <Testimonials />
                  <Contact />
                </main>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/visitor-login" element={<VisitorLogin />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/teacher-assignments" element={<TeacherAssignments />} />
            <Route path="/student-assignments" element={<StudentAssignments />} />
            <Route path="/schedule" element={<ScheduleViewer />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <WhatsAppWidget />
        </div>
        </Router>
      </AssignmentProvider>
    </AuthProvider>
  );
};

export default App;
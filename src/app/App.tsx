import { useState } from 'react';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'teacher' | null>(null);

  const handleLogin = (role: 'student' | 'teacher') => {
    setUserRole(role);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole(null);
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  if (userRole === 'student') {
    return <StudentDashboard onLogout={handleLogout} />;
  }

  if (userRole === 'teacher') {
    return <TeacherDashboard onLogout={handleLogout} />;
  }

  return null;
}
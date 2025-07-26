import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Use named import for jwt-decode
import './index.css';

import HomePage from './pages/HomePage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AnnouncementPostPage from './pages/AnnouncementPostPage';
import ChatBot from './components/Home/ChatBot';

// ProtectedRoute component to handle authentication and role-based access
const ProtectedRoute = ({ element, allowedRoles }) => {
  const token = localStorage.getItem('token');
  let isAuthenticated = false;
  let userRole = null;

  if (token) {
    try {
      const decoded = jwtDecode(token);
      userRole = decoded.role;
      isAuthenticated = true;
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token'); // Remove invalid token
    }
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but role is not allowed, redirect to login
  if (allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated and role is allowed, render the component
  return element;
};

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public route: Home page (no protection needed) */}
          <Route path="/" element={<HomePage />} />

          {/* Protected routes */}
          <Route
            path="/student-dashboard"
            element={<ProtectedRoute element={<StudentDashboardPage />} allowedRoles={['student']} />}
          />
          <Route
            path="/admin-dashboard"
            element={<ProtectedRoute element={<AdminDashboardPage />} allowedRoles={['admin']} />}
          />
          <Route
            path="/announcements"
            element={<ProtectedRoute element={<AnnouncementPostPage />} allowedRoles={['admin', 'student']} />}
          />
          <Route path="/login" element={<LoginPage />} />
          {/* Add more routes as needed */}
        </Routes>
        <ChatBot />
      </div>
    </Router>
  );
}

export default App;
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';

import HomePage from './pages/HomePage';
import StudentDashboardPage from './pages/StudentDashboardPage';
import LoginPage from './pages/LoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage'; // Create this component
import AnnouncementPostPage from './pages/AnnouncementPostPage';
import AnnouncementsSection from './components/AdminDashboard/AnnouncementsSection';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/student-dashboard" element={<StudentDashboardPage />} />
          <Route path="/admin-dashboard" element={<AdminDashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/announcements" element={<AnnouncementPostPage />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
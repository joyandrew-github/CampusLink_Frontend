import React, { useState } from 'react';
import { 
  AlertCircle, 
  Search, 
  Calendar, 
  Settings, 
  Users, 
  Newspaper,
 
} from 'lucide-react';
import Header from '../components/Home/Header';
import Hero from '../components/Home/HeroSection';
import Features from '../components/Home/Features';
import Announcements from '../components/Home/Announcements';
import Footer from '../components/Home/Footer';
import ChatBot from '../components/Home/ChatBot';


const Homepage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const features = [
    {
      icon: AlertCircle,
      title: 'Campus Announcements',
      description: 'Stay updated with real-time announcements from administration about events, exams, and important notices.',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      icon: Search,
      title: 'Lost & Found',
      description: 'Report lost items or help others find their belongings with our intelligent matching system.',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      icon: Calendar,
      title: 'Timetable Scheduler',
      description: 'Organize your academic schedule with our intuitive timetable management system.',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    },
    {
      icon: Settings,
      title: 'Hostel Complaints',
      description: 'Register and track maintenance requests for hostel facilities with real-time status updates.',
      color: 'bg-orange-50 text-orange-600 border-orange-200'
    },
    {
      icon: Users,
      title: 'Skill Exchange',
      description: 'Connect with peers to learn new skills or teach others in collaborative learning sessions.',
      color: 'bg-amber-50 text-amber-600 border-amber-200'
    },
    {
      icon: Newspaper,
      title: 'Tech News & Opportunities',
      description: 'Discover hackathons, internships, and tech news curated specifically for students.',
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200'
    }
  ];

  const stats = [
    { number: '2,500+', label: 'Active Students' },
    { number: '150+', label: 'Daily Announcements' },
    { number: '98%', label: 'Issue Resolution Rate' },
    { number: '24/7', label: 'Platform Availability' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-amber-50">
      <Header isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
      <Hero stats={stats} />
      <Features features={features} />
      <Announcements />
      <Footer />
      
      <ChatBot/>
      
    </div>
  );
};

export default Homepage;
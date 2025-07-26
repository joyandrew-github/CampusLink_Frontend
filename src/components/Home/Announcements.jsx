import React from 'react';
import { Trophy, BookOpen, AlertCircle, Code, Briefcase, Newspaper } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const Announcements = () => {
    const navigate = useNavigate();
  const announcements = [
    {
      category: 'Event',
      icon: Trophy,
      title: 'Annual Tech Fest 2025',
      description: 'Registration open for coding contests, robotics, and project exhibitions.'
    },
    {
      category: 'Exam',
      icon: BookOpen,
      title: 'Mid-Semester Schedule',
      description: 'Examination timetable published. Check your department notice boards.'
    },
    {
      category: 'Holiday',
      icon: AlertCircle,
      title: 'Independence Day Notice',
      description: 'College closed on August 15th. Flag hoisting ceremony on August 14th.'
    },
    {
      category: 'Hackathon',
      icon: Code,
      title: '48-Hour Coding Challenge',
      description: 'Build innovative solutions for real-world problems. Prizes worth ₹50,000.'
    },
    {
      category: 'Internship',
      icon: Briefcase,
      title: 'Summer Internship Drive',
      description: 'Top tech companies visiting campus for internship opportunities.'
    },
    {
      category: 'Tech News',
      icon: Newspaper,
      title: 'New Lab Equipment Arrival',
      description: 'Advanced AI/ML workstations installed in Computer Science department.'
    }
  ];

  return (
    <section id="announcements" className="py-20 bg-gradient-to-br from-gray-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Campus Updates</h2>
          <p className="text-xl text-gray-600">Stay informed with real-time announcements from your college</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {announcements.map((announcement, index) => {
            const IconComponent = announcement.icon;
            return (
              <div key={index} className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4">
                  <div className="flex items-center space-x-2">
                    <IconComponent className="h-5 w-5 text-white" />
                    <span className="text-white font-medium">{announcement.category}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{announcement.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{announcement.description}</p>
                  <div className="inline-flex items-center px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium">
                    {announcement.category}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <button onClick={()=>navigate('/announcements')}className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200">
            View All Announcements
          </button>
        </div>
      </div>
    </section>
  );
};

export default Announcements;
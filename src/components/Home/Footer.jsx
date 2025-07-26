import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="mb-12">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img src="https://res.cloudinary.com/duwvhcha4/image/upload/v1753507942/logosece_pj0sr9.png" alt="CampusLink Logo" className="h-20 w-18" />
              <div>
                <h3 className="text-2xl font-bold text-white">CampusLink</h3>
                <p className="text-sm text-gray-400">Sri Eshwar College of Engineering</p>
              </div>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-2xl mx-auto mb-8">
              Empowering students through digital innovation. CampusLink connects our college community, 
              streamlines daily activities, and fosters collaboration among students, faculty, and administration. 
              Building tomorrow's leaders through seamless technology integration.
            </p>
            
            <div>
              <h4 className="font-semibold mb-6 text-lg">Quick Links</h4>
              <div className="flex justify-center">
                <ul className="flex space-x-8 text-gray-400">
                  <li><a href="#home" className="hover:text-amber-400 transition-colors">Home</a></li>
                  <li><a href="#features" className="hover:text-amber-400 transition-colors">Features</a></li>
                  <li><a href="#announcements" className="hover:text-amber-400 transition-colors">Announcements</a></li>
                  <li><a href="#dashboard" className="hover:text-amber-400 transition-colors">Dashboard</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 text-sm mb-4 md:mb-0">
              © 2025 CampusLink - Sri Eshwar College of Engineering. All rights reserved.
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-400">
              <span>Made with</span>
              <span className="text-red-400">❤️</span>
              <span>for SECE Students</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
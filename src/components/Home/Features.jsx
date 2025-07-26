import React from 'react';
import { Lightbulb } from 'lucide-react';

const Features = ({ features }) => {
  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-amber-100 text-amber-800 rounded-full text-sm font-medium mb-4">
            <Lightbulb className="h-4 w-4 mr-2" />
            Powerful Features
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need for Campus Life</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            From staying informed to managing your schedule, CampusLink provides all the tools you need to succeed in college.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div key={index} className="group bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-xl hover:border-transparent transition-all duration-300 transform hover:-translate-y-2">
                <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
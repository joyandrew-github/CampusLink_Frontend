// src/components/SettingsSection.jsx
import React, { useState } from 'react';

const SettingsSection = () => {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    pushNotifications: false,
    contactInfoVisible: true,
    timetableVisible: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setSettings((prev) => ({ ...prev, [name]: checked }));
  };

  const handleSave = () => {
    console.log('Saved settings:', settings);
    // Here you can add API call to persist settings
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Settings</h2>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Notifications</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3" htmlFor="emailNotifications">
                <input
                  id="emailNotifications"
                  name="emailNotifications"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                />
                <span className="text-gray-700">Email notifications for complaint updates</span>
              </label>
              <label className="flex items-center space-x-3" htmlFor="smsNotifications">
                <input
                  id="smsNotifications"
                  name="smsNotifications"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.smsNotifications}
                  onChange={handleChange}
                />
                <span className="text-gray-700">SMS notifications for urgent issues</span>
              </label>
              <label className="flex items-center space-x-3" htmlFor="pushNotifications">
                <input
                  id="pushNotifications"
                  name="pushNotifications"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.pushNotifications}
                  onChange={handleChange}
                />
                <span className="text-gray-700">Push notifications for lost & found matches</span>
              </label>
            </div>
          </div>
          
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Privacy</h3>
            <div className="space-y-3">
              <label className="flex items-center space-x-3" htmlFor="contactInfoVisible">
                <input
                  id="contactInfoVisible"
                  name="contactInfoVisible"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.contactInfoVisible}
                  onChange={handleChange}
                />
                <span className="text-gray-700">Make my contact info visible in lost & found</span>
              </label>
              <label className="flex items-center space-x-3" htmlFor="timetableVisible">
                <input
                  id="timetableVisible"
                  name="timetableVisible"
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  checked={settings.timetableVisible}
                  onChange={handleChange}
                />
                <span className="text-gray-700">Allow others to see my timetable</span>
              </label>
            </div>
          </div>
          <div className="pt-6">
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsSection;
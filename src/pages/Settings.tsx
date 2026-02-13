import { useState, useEffect } from 'react';
import AISettings from '../components/settings/AISettings';

export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          Configure your Dark Mode Generator preferences and AI features.
        </p>

        {/* AI Settings Section */}
        <AISettings />

        {/* Future sections */}
        <div className="mt-8 p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Account Settings
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            More settings coming soon...
          </p>
        </div>
      </div>
    </div>
  );
}

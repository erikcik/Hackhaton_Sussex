'use client';

import { useState, useEffect } from 'react';
import { UserPreferences, PreferenceStep } from '@/types/preferences';
import { motion } from 'framer-motion';
import { checkUserPreferences, saveUserPreferences } from '../actions';
import { VALID_GENDERS } from '@/db/schema';
import { useRouter } from 'next/navigation';
import CloudTransition from '@/components/CloudTransition';

const PreferencesPage = () => {
  const router = useRouter();
  const [step, setStep] = useState<PreferenceStep>('name');
  const [preferences, setPreferences] = useState<UserPreferences>({
    firstName: '',
    lastName: '',
    gender: 'other',
    mainLanguage: '',
    preferredLanguage: '',
    age: 0
  });
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    // Check for existing preferences
    const checkExisting = async () => {
      const existingPrefs = await checkUserPreferences();
      if (existingPrefs) {
        // Type assertion since we know the database values match our types
        setPreferences(existingPrefs as unknown as UserPreferences);
        setStep('complete');
      }
    };
    checkExisting();
  }, []);

  const savePreferences = async () => {
    try {
      const result = await saveUserPreferences(preferences);
      
      if (result.success) {
        setStep('complete');
        setIsTransitioning(true);
        setTimeout(() => {
          router.push('/dashboard');
        }, 2000);
      } else {
        console.error('Error saving preferences:', result.error);
      }
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'name':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-comic-sans text-purple-600">What's your name? 🌟</h2>
            <input
              type="text"
              placeholder="First Name"
              value={preferences.firstName}
              onChange={(e) => setPreferences({ ...preferences, firstName: e.target.value })}
              className="w-full p-4 rounded-xl border-4 border-yellow-400 text-2xl focus:outline-none focus:border-purple-400"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={preferences.lastName}
              onChange={(e) => setPreferences({ ...preferences, lastName: e.target.value })}
              className="w-full p-4 rounded-xl border-4 border-yellow-400 text-2xl focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={() => setStep('gender')}
              className="w-full p-4 bg-green-400 rounded-xl text-white text-2xl hover:bg-green-500 transition-colors"
            >
              Next! 👉
            </button>
          </motion.div>
        );

      case 'gender':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-comic-sans text-purple-600">I am a... 🎈</h2>
            <div className="grid grid-cols-3 gap-4">
              {['boy', 'girl', 'other'].map((gender) => (
                <button
                  key={gender}
                  onClick={() => {
                    setPreferences({ ...preferences, gender: gender as any });
                    setStep('languages');
                  }}
                  className={`p-6 rounded-xl text-2xl ${
                    preferences.gender === gender
                      ? 'bg-blue-400 text-white'
                      : 'bg-blue-100 text-blue-800'
                  }`}
                >
                  {gender === 'boy' ? '👦' : gender === 'girl' ? '👧' : '🌈'} {gender}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 'languages':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-comic-sans text-purple-600">What languages do you speak? 🗣️</h2>
            <select
              value={preferences.mainLanguage}
              onChange={(e) => setPreferences({ ...preferences, mainLanguage: e.target.value })}
              className="w-full p-4 rounded-xl border-4 border-yellow-400 text-2xl"
            >
              <option value="">Select main language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              {/* Add more languages as needed */}
            </select>
            <select
              value={preferences.preferredLanguage}
              onChange={(e) => setPreferences({ ...preferences, preferredLanguage: e.target.value })}
              className="w-full p-4 rounded-xl border-4 border-yellow-400 text-2xl"
            >
              <option value="">Select preferred language</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              {/* Add more languages as needed */}
            </select>
            <button
              onClick={() => setStep('age')}
              className="w-full p-4 bg-green-400 rounded-xl text-white text-2xl hover:bg-green-500 transition-colors"
            >
              Next! 👉
            </button>
          </motion.div>
        );

      case 'age':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-4xl font-comic-sans text-purple-600">How old are you? 🎂</h2>
            <input
              type="number"
              min="0"
              max="18"
              value={preferences.age || ''}
              onChange={(e) => setPreferences({ ...preferences, age: parseInt(e.target.value) })}
              className="w-full p-4 rounded-xl border-4 border-yellow-400 text-2xl focus:outline-none focus:border-purple-400"
            />
            <button
              onClick={savePreferences}
              className="w-full p-4 bg-green-400 rounded-xl text-white text-2xl hover:bg-green-500 transition-colors"
            >
              Finish! 🎉
            </button>
          </motion.div>
        );

      case 'complete':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-6"
          >
            <h2 className="text-4xl font-comic-sans text-purple-600">All Done! 🎉</h2>
            <p className="text-2xl text-gray-600">Thanks for sharing your preferences!</p>
            <div className="text-8xl">🌟</div>
          </motion.div>
        );
    }
  };

  return (
    <div className="relative">
      <div className="min-h-screen bg-gradient-to-b from-pink-100 to-blue-100 p-8">
        <div className="max-w-2xl mx-auto">
          {renderStep()}
        </div>
      </div>
      <CloudTransition isTransitioning={isTransitioning} />
    </div>
  );
};

export default PreferencesPage; 
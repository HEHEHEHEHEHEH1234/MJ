import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { UserPreferences } from '../types';
import { CheckCircle2 } from 'lucide-react';

const GRADE_LEVELS = ['K-2', '3-5', '6-8', '9-12'];
const SUBJECTS = ['Math', 'Science', 'English', 'History', 'Art', 'Music'];
const LEARNING_STYLES = ['Visual', 'Auditory', 'Reading/Writing', 'Kinesthetic'];
const INTERESTS = [
  'Technology',
  'Nature',
  'Sports',
  'Music',
  'Art',
  'Reading',
  'Writing',
  'Coding',
];

export const Survey: React.FC = () => {
  const updatePreferences = useUserStore((state) => state.updatePreferences);
  const [preferences, setPreferences] = useState<UserPreferences>({
    gradeLevel: '',
    subjects: [],
    learningStyle: '',
    interests: [],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferences(preferences);
  };

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter((i) => i !== item)
      : [...array, item];
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Learning Profile</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Grade Level
          </label>
          <div className="grid grid-cols-2 gap-2">
            {GRADE_LEVELS.map((grade) => (
              <button
                key={grade}
                type="button"
                onClick={() => setPreferences({ ...preferences, gradeLevel: grade })}
                className={`p-3 rounded-lg border ${
                  preferences.gradeLevel === grade
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {grade}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subjects (Select multiple)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {SUBJECTS.map((subject) => (
              <button
                key={subject}
                type="button"
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    subjects: toggleArrayItem(preferences.subjects, subject),
                  })
                }
                className={`p-3 rounded-lg border ${
                  preferences.subjects.includes(subject)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {subject}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Learning Style
          </label>
          <div className="grid grid-cols-2 gap-2">
            {LEARNING_STYLES.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setPreferences({ ...preferences, learningStyle: style })}
                className={`p-3 rounded-lg border ${
                  preferences.learningStyle === style
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interests (Select multiple)
          </label>
          <div className="grid grid-cols-2 gap-2">
            {INTERESTS.map((interest) => (
              <button
                key={interest}
                type="button"
                onClick={() =>
                  setPreferences({
                    ...preferences,
                    interests: toggleArrayItem(preferences.interests, interest),
                  })
                }
                className={`p-3 rounded-lg border ${
                  preferences.interests.includes(interest)
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                    : 'border-gray-200 hover:border-indigo-200'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full btn btn-primary flex items-center justify-center"
          disabled={
            !preferences.gradeLevel ||
            preferences.subjects.length === 0 ||
            !preferences.learningStyle ||
            preferences.interests.length === 0
          }
        >
          <CheckCircle2 className="w-5 h-5 mr-2" />
          Save Preferences
        </button>
      </form>
    </div>
  );
};
import React, { useState } from 'react';
import { useUserStore } from '../store/userStore';
import { BookOpen, Video, MessageSquare, Mic, ClipboardList, X, Settings } from 'lucide-react';
import { WorksheetGenerator } from './features/WorksheetGenerator';
import { VideoSearch } from './features/VideoSearch';
import { AIChat } from './features/AIChat';
import { VoiceInteraction } from './features/VoiceInteraction';
import { Survey } from './Survey';

const features = [
  {
    id: 'worksheet',
    icon: ClipboardList,
    title: 'Worksheet Generator',
    description: 'Create custom worksheets tailored to your needs',
    component: WorksheetGenerator,
  },
  {
    id: 'videos',
    icon: Video,
    title: 'Educational Videos',
    description: 'Find curated educational content',
    component: VideoSearch,
  },
  {
    id: 'chat',
    icon: MessageSquare,
    title: 'AI Assistant',
    description: 'Get help with your studies',
    component: AIChat,
  },
  {
    id: 'voice',
    icon: Mic,
    title: 'Voice Interaction',
    description: 'Talk to learn',
    component: VoiceInteraction,
  },
];

export const Dashboard: React.FC = () => {
  const user = useUserStore((state) => state.user);
  const clearUser = useUserStore((state) => state.clearUser);
  const [activeFeature, setActiveFeature] = useState<string | null>(null);
  const [showSurvey, setShowSurvey] = useState(false);

  if (!user?.hasSurvey || showSurvey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to SPARK, {user?.name}!
            </h1>
            <button
              onClick={() => clearUser()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
          <Survey />
        </div>
      </div>
    );
  }

  const ActiveComponent = activeFeature
    ? features.find(f => f.id === activeFeature)?.component
    : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Welcome to SPARK, {user?.name}!
            </h1>
            <p className="text-gray-600 mt-2">What would you like to explore today?</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setShowSurvey(true)}
              className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
            >
              <Settings className="w-5 h-5 mr-1" />
              Update Preferences
            </button>
            <button
              onClick={() => clearUser()}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>

        {activeFeature ? (
          <div className="relative">
            <button
              onClick={() => setActiveFeature(null)}
              className="absolute right-4 top-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            {ActiveComponent && <ActiveComponent />}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature) => (
              <div
                key={feature.id}
                onClick={() => setActiveFeature(feature.id)}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              >
                <feature.icon className="w-12 h-12 text-indigo-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
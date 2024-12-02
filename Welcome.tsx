import React, { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { LoginForm } from './auth/LoginForm';
import { RegisterForm } from './auth/RegisterForm';

export const Welcome: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <BookOpen className="w-16 h-16 text-indigo-600 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to SPARK</h1>
      <p className="text-lg text-gray-600 mb-8">Your Personalized Educational Journey Begins Here</p>
      
      <div className="w-full max-w-md">
        {isLogin ? <LoginForm /> : <RegisterForm />}
        
        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:text-indigo-700"
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
          </button>
        </div>
      </div>
    </div>
  );
};
import React, { useState } from 'react';
import { chatWithAI } from '../../services/api';
import { Loader2, Send } from 'lucide-react';
import { ErrorMessage } from '../ErrorMessage';

export const AIChat: React.FC = () => {
  const [message, setMessage] = useState('');
  const [conversation, setConversation] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const userMessage = message;
    setMessage('');
    setError(null);
    setConversation(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await chatWithAI(userMessage);
      setConversation(prev => [...prev, { role: 'ai', content: response }]);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-xl shadow-lg h-[600px] flex flex-col">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">AI Learning Assistant</h2>
      
      {error && (
        <div className="mb-4">
          <ErrorMessage message={error} />
        </div>
      )}

      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {conversation.map((msg, index) => (
          <div
            key={index}
            className={`p-3 rounded-lg ${
              msg.role === 'user'
                ? 'bg-indigo-100 ml-auto max-w-[80%]'
                : 'bg-gray-100 mr-auto max-w-[80%]'
            }`}
          >
            {msg.content}
          </div>
        ))}
        {loading && (
          <div className="flex items-center justify-center">
            <Loader2 className="animate-spin text-indigo-600" />
          </div>
        )}
      </div>
      
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="input flex-1"
          placeholder="Ask anything..."
          disabled={loading}
        />
        <button
          type="submit"
          disabled={loading || !message.trim()}
          className="btn btn-primary px-6"
        >
          <Send className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};
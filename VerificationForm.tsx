import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { verifyEmail } from '../../services/authService';
import { ErrorMessage } from '../ErrorMessage';

interface VerificationFormProps {
  email: string;
  onVerified: () => void;
  onBack: () => void;
}

export const VerificationForm: React.FC<VerificationFormProps> = ({
  email,
  onVerified,
  onBack,
}) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await verifyEmail(email, code);
      onVerified();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-center p-6 bg-white rounded-xl shadow-lg">
      <Mail className="w-16 h-16 text-indigo-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Verify Your Email</h2>
      <p className="text-gray-600 mb-6">
        Please check the console for the verification code sent to {email}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <ErrorMessage message={error} />}

        <div>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="w-full input text-center text-2xl tracking-widest"
            placeholder="ENTER CODE"
            maxLength={6}
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full btn btn-primary flex items-center justify-center"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin mr-2" />
              Verifying...
            </>
          ) : (
            'Verify Email'
          )}
        </button>

        <button
          type="button"
          onClick={onBack}
          className="text-indigo-600 hover:text-indigo-700"
        >
          Back to Login
        </button>
      </form>
    </div>
  );
};
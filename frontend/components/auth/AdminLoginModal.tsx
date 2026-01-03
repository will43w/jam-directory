'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { useAuth } from './AuthProvider';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamId: string;
}

export function AdminLoginModal({ isOpen, onClose, jamId }: AdminLoginModalProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // Store jamId in localStorage for redirect after auth
      if (typeof window !== 'undefined') {
        localStorage.setItem('pendingAuthJamId', jamId);
      }
      
      // Normalize origin: use 127.0.0.1 instead of localhost to match Supabase's site_url
      const origin = window.location.origin.replace('localhost', '127.0.0.1');
      const redirectTo = `${origin}/auth/callback?jamId=${encodeURIComponent(jamId)}`;
      await signIn(email, redirectTo);
      setEmailSent(true);
    } catch (err: any) {
      setError(err.message || 'Failed to send magic link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setError(null);
    setEmailSent(false);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Admin Login">
      {emailSent ? (
        <div className="space-y-4">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
              <svg
                className="h-6 w-6 text-green-600"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Check your email</h3>
            <p className="text-sm text-gray-600 mb-4">
              We've sent a magic link to <strong>{email}</strong>. Click the link in the email to sign in.
            </p>
            <p className="text-xs text-gray-500">
              You'll be redirected back to this page after signing in.
            </p>
          </div>
          <Button onClick={handleClose} variant="secondary" className="w-full">
            Close
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-sm text-gray-500">
            You have to be a registered admin to make edits. If you're not, you can suggest edits at the bottom of the page. 
          </p>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
              placeholder="admin@example.com"
            />
          </div>
          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
          )}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={loading || !email}
              className="flex-1"
            >
              {loading ? 'Sending...' : 'Send magic link'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}


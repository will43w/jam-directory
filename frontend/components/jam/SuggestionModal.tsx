'use client';

import { useState } from 'react';
import type { SuggestionType, CreateSuggestionData } from '@/lib/types';
import { submitSuggestion } from '@/lib/services/suggestionService';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface SuggestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  jamId: string | null;
}

const suggestionTypes: { value: SuggestionType; label: string }[] = [
  { value: 'update_info', label: 'Missing contact' },
  { value: 'update_info', label: 'Wrong time/day' },
  { value: 'inactive', label: 'Jam inactive' },
  { value: 'other', label: 'Other' },
];

export function SuggestionModal({ isOpen, onClose, jamId }: SuggestionModalProps) {
  const [suggestionType, setSuggestionType] = useState<SuggestionType>('other');
  const [message, setMessage] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const data: CreateSuggestionData = {
        jam_id: jamId,
        suggestion_type: suggestionType,
        message,
        source_url: sourceUrl || null,
      };

      await submitSuggestion(data);
      setSuccess(true);
      
      // Reset form and close after a moment
      setTimeout(() => {
        setSuggestionType('other');
        setMessage('');
        setSourceUrl('');
        setSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit suggestion');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Help the community">
      {success ? (
        <div className="text-center py-4">
          <p className="text-green-600 font-medium">Thank you! Your suggestion has been submitted.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What&apos;s wrong / missing?
            </label>
            <div className="space-y-2">
              {suggestionTypes.map((type) => (
                <label key={type.value} className="flex items-center">
                  <input
                    type="radio"
                    name="suggestionType"
                    value={type.value}
                    checked={suggestionType === type.value}
                    onChange={(e) => setSuggestionType(e.target.value as SuggestionType)}
                    className="mr-2"
                  />
                  <span className="text-gray-700">{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Tell us what you know..."
            />
          </div>

          <div>
            <label htmlFor="sourceUrl" className="block text-sm font-medium text-gray-700 mb-2">
              Source URL (optional)
            </label>
            <input
              id="sourceUrl"
              type="url"
              value={sourceUrl}
              onChange={(e) => setSourceUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://..."
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <div className="flex gap-3 justify-end">
            <Button type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}


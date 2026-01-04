'use client';

import { useState } from 'react';
import type { Jam, CreateJamData, UpdateJamData } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface JamEditFormProps {
  jam?: Jam;
  onSave: (data: CreateJamData | UpdateJamData) => Promise<void>;
  onCancel: () => void;
}

export function JamEditForm({ jam, onSave, onCancel }: JamEditFormProps) {
  const [formData, setFormData] = useState<CreateJamData>({
    name: jam?.name || '',
    city: jam?.city || '',
    venue_name: jam?.venue_name || '',
    venue_address: jam?.venue_address || '',
    latitude: jam?.latitude || null,
    longitude: jam?.longitude || null,
    description: jam?.description || null,
    skill_level: jam?.skill_level || null,
    image_url: jam?.image_url || null,
    canonical_source_url: jam?.canonical_source_url || null,
    schedule: jam?.schedule || null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await onSave(formData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save jam');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Jam Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
          City *
        </label>
        <input
          id="city"
          type="text"
          required
          value={formData.city}
          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="venue_name" className="block text-sm font-medium text-gray-700 mb-1">
          Venue Name *
        </label>
        <input
          id="venue_name"
          type="text"
          required
          value={formData.venue_name}
          onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="venue_address" className="block text-sm font-medium text-gray-700 mb-1">
          Venue Address *
        </label>
        <input
          id="venue_address"
          type="text"
          required
          value={formData.venue_address}
          onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
            Latitude
          </label>
          <input
            id="latitude"
            type="number"
            step="any"
            value={formData.latitude || ''}
            onChange={(e) => setFormData({ ...formData, latitude: e.target.value ? Number(e.target.value) : null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
            Longitude
          </label>
          <input
            id="longitude"
            type="number"
            step="any"
            value={formData.longitude || ''}
            onChange={(e) => setFormData({ ...formData, longitude: e.target.value ? Number(e.target.value) : null })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          rows={4}
          value={formData.description || ''}
          onChange={(e) => setFormData({ ...formData, description: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="skill_level" className="block text-sm font-medium text-gray-700 mb-1">
          Skill Level
        </label>
        <input
          id="skill_level"
          type="text"
          value={formData.skill_level || ''}
          onChange={(e) => setFormData({ ...formData, skill_level: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
          Image URL
        </label>
        <input
          id="image_url"
          type="url"
          value={formData.image_url || ''}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="canonical_source_url" className="block text-sm font-medium text-gray-700 mb-1">
          Canonical Source URL
        </label>
        <input
          id="canonical_source_url"
          type="url"
          value={formData.canonical_source_url || ''}
          onChange={(e) => setFormData({ ...formData, canonical_source_url: e.target.value || null })}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700 mb-1">
          Schedule
        </label>
        <textarea
          id="schedule"
          rows={3}
          value={formData.schedule || ''}
          onChange={(e) => setFormData({ ...formData, schedule: e.target.value || null })}
          placeholder="e.g., Last Thursday of every month, Every other Tuesday at 7pm"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
      </div>
    </form>
  );
}


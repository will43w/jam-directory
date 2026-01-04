'use client';

import { useState } from 'react';
import type { JamUpdateSource, UpdateSourceType, CreateUpdateSourceData, UpdateUpdateSourceData } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface UpdateSourcesSectionProps {
  updateSources: JamUpdateSource[];
  isEditMode?: boolean;
  jamId?: string;
  onUpdateSourceCreate?: (data: CreateUpdateSourceData) => Promise<void>;
  onUpdateSourceUpdate?: (id: string, data: UpdateUpdateSourceData) => Promise<void>;
  onUpdateSourceDelete?: (id: string) => Promise<void>;
}

const UPDATE_SOURCE_TYPES: UpdateSourceType[] = ['website', 'facebook', 'instagram', 'twitter', 'other'];

function formatUpdateSourceLink(source: JamUpdateSource): { href: string; label: string } | null {
  const value = source.source_value.trim();
  
  switch (source.source_type) {
    case 'website':
      return { href: value.startsWith('http') ? value : `https://${value}`, label: value };
    case 'instagram':
      return {
        href: value.startsWith('@') ? `https://instagram.com/${value.slice(1)}` : value.startsWith('http') ? value : `https://instagram.com/${value}`,
        label: value.startsWith('@') ? value : value.startsWith('http') ? value : `@${value}`,
      };
    case 'facebook':
      return {
        href: value.startsWith('http') ? value : `https://facebook.com/${value}`,
        label: value,
      };
    case 'twitter':
      return {
        href: value.startsWith('@') ? `https://twitter.com/${value.slice(1)}` : value.startsWith('http') ? value : `https://twitter.com/${value}`,
        label: value.startsWith('@') ? value : value.startsWith('http') ? value : `@${value}`,
      };
    default:
      return { href: value, label: value };
  }
}

function getUpdateSourceIcon(type: JamUpdateSource['source_type']): string {
  switch (type) {
    case 'website':
      return '🌐';
    case 'instagram':
      return '📷';
    case 'facebook':
      return '👥';
    case 'twitter':
      return '🐦';
    default:
      return '📢';
  }
}

export function UpdateSourcesSection({ 
  updateSources, 
  isEditMode = false,
  jamId,
  onUpdateSourceCreate,
  onUpdateSourceUpdate,
  onUpdateSourceDelete,
}: UpdateSourcesSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateUpdateSourceData>({
    jam_id: jamId || '',
    source_type: 'website',
    source_value: '',
    is_primary: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primarySource = updateSources.find(s => s.is_primary) || updateSources[0];
  const otherSources = updateSources.filter(s => s.id !== primarySource?.id);

  const handleEdit = (source: JamUpdateSource) => {
    setEditingId(source.id);
    setFormData({
      jam_id: source.jam_id,
      source_type: source.source_type,
      source_value: source.source_value,
      is_primary: source.is_primary,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      jam_id: jamId || '',
      source_type: 'website',
      source_value: '',
      is_primary: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onUpdateSourceCreate || !onUpdateSourceUpdate) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { jam_id, ...updateData } = formData;
        await onUpdateSourceUpdate(editingId, updateData);
      } else {
        await onUpdateSourceCreate(formData);
      }
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isEditMode) {
    if (updateSources.length === 0) {
      return (
        <div>
          <p className="text-gray-600">No update sources available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-2">
        {updateSources.map((source) => (
          <UpdateSourceItem key={source.id} source={source} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {primarySource && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Primary update source:
          </p>
          {editingId === primarySource.id ? (
            <UpdateSourceEditForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="flex items-center justify-between">
              <UpdateSourceItem source={primarySource} />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(primarySource)}
                >
                  Edit
                </Button>
                {onUpdateSourceDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onUpdateSourceDelete(primarySource.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {otherSources.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Other update sources:</h3>
          {otherSources.map((source) => (
            editingId === source.id ? (
              <UpdateSourceEditForm
                key={source.id}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div key={source.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
                <UpdateSourceItem source={source} />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(source)}
                  >
                    Edit
                  </Button>
                  {onUpdateSourceDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onUpdateSourceDelete(source.id)}
                    >
                      Delete
                    </Button>
                  )}
                </div>
              </div>
            )
          ))}
        </div>
      )}

      {isAdding ? (
        <UpdateSourceEditForm
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={isSubmitting}
        />
      ) : (
        <Button
          variant="secondary"
          size="sm"
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
          }}
        >
          + Add Update Source
        </Button>
      )}
    </div>
  );
}

function UpdateSourceItem({ source }: { source: JamUpdateSource }) {
  const linkInfo = formatUpdateSourceLink(source);
  const icon = getUpdateSourceIcon(source.source_type);
  
  if (!linkInfo) {
    return (
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-gray-700">{source.source_value}</span>
      </div>
    );
  }
  
  return (
    <a
      href={linkInfo.href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 text-blue-600 hover:text-blue-800 hover:underline"
    >
      <span>{icon}</span>
      <span>{linkInfo.label}</span>
    </a>
  );
}

function UpdateSourceEditForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  formData: CreateUpdateSourceData;
  setFormData: (data: CreateUpdateSourceData) => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  isSubmitting: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="p-4 border border-blue-300 rounded-lg bg-white space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type
          </label>
          <select
            value={formData.source_type}
            onChange={(e) => setFormData({ ...formData, source_type: e.target.value as UpdateSourceType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {UPDATE_SOURCE_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value
          </label>
          <input
            type="text"
            required
            value={formData.source_value}
            onChange={(e) => setFormData({ ...formData, source_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="https://example.com or @username"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={formData.is_primary}
          onChange={(e) => setFormData({ ...formData, is_primary: e.target.checked })}
          className="w-4 h-4"
        />
        <label className="text-sm font-medium text-gray-700">Primary source</label>
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}


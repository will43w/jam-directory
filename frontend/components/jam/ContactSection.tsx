'use client';

import { useState } from 'react';
import type { JamContact, ContactType, CreateContactData, UpdateContactData } from '@/lib/types';
import { Button } from '@/components/ui/Button';

interface ContactSectionProps {
  contacts: JamContact[];
  isEditMode?: boolean;
  jamId?: string;
  onContactCreate?: (data: CreateContactData) => Promise<void>;
  onContactUpdate?: (id: string, data: UpdateContactData) => Promise<void>;
  onContactDelete?: (id: string) => Promise<void>;
}

const CONTACT_TYPES: ContactType[] = ['email', 'instagram', 'facebook', 'website', 'other'];

function formatContactLink(contact: JamContact): { href: string; label: string } | null {
  const value = contact.contact_value.trim();
  
  switch (contact.contact_type) {
    case 'email':
      return { href: `mailto:${value}`, label: value };
    case 'website':
      return { href: value.startsWith('http') ? value : `https://${value}`, label: value };
    case 'instagram':
      return {
        href: value.startsWith('@') ? `https://instagram.com/${value.slice(1)}` : `https://instagram.com/${value}`,
        label: value.startsWith('@') ? value : `@${value}`,
      };
    case 'facebook':
      return {
        href: value.startsWith('http') ? value : `https://facebook.com/${value}`,
        label: value,
      };
    default:
      return { href: value, label: value };
  }
}

function getContactIcon(type: JamContact['contact_type']): string {
  switch (type) {
    case 'email':
      return '✉️';
    case 'instagram':
      return '📷';
    case 'facebook':
      return '👥';
    case 'website':
      return '🌐';
    default:
      return '📞';
  }
}

export function ContactSection({ 
  contacts, 
  isEditMode = false,
  jamId,
  onContactCreate,
  onContactUpdate,
  onContactDelete,
}: ContactSectionProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<CreateContactData>({
    jam_id: jamId || '',
    contact_type: 'email',
    contact_value: '',
    is_primary: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const primaryContact = contacts.find(c => c.is_primary) || contacts[0];
  const otherContacts = contacts.filter(c => c.id !== primaryContact?.id);

  const handleEdit = (contact: JamContact) => {
    setEditingId(contact.id);
    setFormData({
      jam_id: contact.jam_id,
      contact_type: contact.contact_type,
      contact_value: contact.contact_value,
      is_primary: contact.is_primary,
    });
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      jam_id: jamId || '',
      contact_type: 'email',
      contact_value: '',
      is_primary: false,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!onContactCreate || !onContactUpdate) return;
    setIsSubmitting(true);
    try {
      if (editingId) {
        const { jam_id, ...updateData } = formData;
        await onContactUpdate(editingId, updateData);
      } else {
        await onContactCreate(formData);
      }
      handleCancel();
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!isEditMode) {
    if (contacts.length === 0) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-gray-600">No contact information available</p>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {primaryContact && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <p className="text-sm font-medium text-blue-900 mb-2">
              Best place to confirm tonight&apos;s details:
            </p>
            <ContactItem contact={primaryContact} />
          </div>
        )}
        
        {otherContacts.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900">Other contact methods:</h3>
            {otherContacts.map((contact) => (
              <ContactItem key={contact.id} contact={contact} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {primaryContact && (
        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
          <p className="text-sm font-medium text-blue-900 mb-2">
            Best place to confirm tonight&apos;s details:
          </p>
          {editingId === primaryContact.id ? (
            <ContactEditForm
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              isSubmitting={isSubmitting}
            />
          ) : (
            <div className="flex items-center justify-between">
              <ContactItem contact={primaryContact} />
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(primaryContact)}
                >
                  Edit
                </Button>
                {onContactDelete && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onContactDelete(primaryContact.id)}
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
      
      {otherContacts.length > 0 && (
        <div className="space-y-2">
          <h3 className="font-medium text-gray-900">Other contact methods:</h3>
          {otherContacts.map((contact) => (
            editingId === contact.id ? (
              <ContactEditForm
                key={contact.id}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                isSubmitting={isSubmitting}
              />
            ) : (
              <div key={contact.id} className="p-3 border border-gray-200 rounded-lg flex items-center justify-between hover:bg-gray-50">
                <ContactItem contact={contact} />
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEdit(contact)}
                  >
                    Edit
                  </Button>
                  {onContactDelete && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => onContactDelete(contact.id)}
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
        <ContactEditForm
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
          + Add Contact
        </Button>
      )}
    </div>
  );
}

function ContactItem({ contact }: { contact: JamContact }) {
  const linkInfo = formatContactLink(contact);
  const icon = getContactIcon(contact.contact_type);
  
  if (!linkInfo) {
    return (
      <div className="flex items-center gap-2">
        <span>{icon}</span>
        <span className="text-gray-700">{contact.contact_value}</span>
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

function ContactEditForm({
  formData,
  setFormData,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  formData: CreateContactData;
  setFormData: (data: CreateContactData) => void;
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
            value={formData.contact_type}
            onChange={(e) => setFormData({ ...formData, contact_type: e.target.value as ContactType })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {CONTACT_TYPES.map((type) => (
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
            value={formData.contact_value}
            onChange={(e) => setFormData({ ...formData, contact_value: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="email@example.com"
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
        <label className="text-sm font-medium text-gray-700">Primary contact</label>
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


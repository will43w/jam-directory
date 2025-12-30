import type { JamContact } from '@/lib/types';

interface ContactSectionProps {
  contacts: JamContact[];
}

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

export function ContactSection({ contacts }: ContactSectionProps) {
  const primaryContact = contacts.find(c => c.is_primary) || contacts[0];
  const otherContacts = contacts.filter(c => c.id !== primaryContact?.id);
  
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


import type { JamWithRelations, UpcomingDate } from '@/lib/types';
import { ScheduleDisplay } from './ScheduleDisplay';
import { UpcomingDates } from './UpcomingDates';
import { ContactSection } from './ContactSection';
import { Button } from '@/components/ui/Button';
import { computeUpcomingDates } from '@/lib/utils/dateUtils';

interface JamDetailProps {
  jam: JamWithRelations;
  onSuggestionClick: () => void;
}

export function JamDetail({ jam, onSuggestionClick }: JamDetailProps) {
  const upcomingDates = computeUpcomingDates(jam.schedules, jam.occurrences, 6);
  
  return (
    <div className="space-y-6">
      {/* Hero Image */}
      {jam.image_url && (
        <div className="w-full h-64 md:h-96 bg-gray-200 rounded-lg overflow-hidden">
          <img
            src={jam.image_url}
            alt={jam.name}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      {/* Basic Info */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{jam.name}</h1>
        <p className="text-xl text-gray-700 mb-1">{jam.venue_name}</p>
        {jam.venue_address && (
          <p className="text-gray-600">{jam.venue_address}</p>
        )}
      </div>
      
      {/* Description */}
      {jam.description && (
        <div>
          <h2 className="text-xl font-semibold mb-2">About</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{jam.description}</p>
        </div>
      )}
      
      {/* Schedule */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Schedule</h2>
        <ScheduleDisplay schedules={jam.schedules} />
      </div>
      
      {/* Upcoming Dates */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Upcoming Dates</h2>
        <UpcomingDates dates={upcomingDates} />
      </div>
      
      {/* Contact */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Contact</h2>
        <ContactSection contacts={jam.contacts} />
      </div>
      
      {/* Canonical Source */}
      {jam.canonical_source_url && (
        <div>
          <a
            href={jam.canonical_source_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            View original source →
          </a>
        </div>
      )}
      
      {/* Suggestion Button */}
      <div className="pt-4 border-t">
        <Button onClick={onSuggestionClick} variant="secondary" className="w-full md:w-auto">
          Got info on this jam? Help the community out
        </Button>
      </div>
    </div>
  );
}


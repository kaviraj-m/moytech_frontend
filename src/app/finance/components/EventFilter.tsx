import { Event } from '../types';

interface Props {
  events: Event[];
  selectedEventId: number | '';
  onEventChange: (eventId: number | '') => void;
}

export default function EventFilter({ events, selectedEventId, onEventChange }: Props) {
  return (
    <div className="mb-6 sm:mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <label className="text-sm font-medium text-[#343A40] whitespace-nowrap">Filter by Event:</label>
        <div className="relative w-full max-w-xs">
          <select
            value={selectedEventId}
            onChange={(e) => onEventChange(e.target.value === '' ? '' : Number(e.target.value))}
            className="w-full pl-3 pr-8 py-2.5 border-2 border-gray-200 rounded-lg bg-white text-[#343A40] appearance-none focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/30 transition-all"
          >
            <option value="">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id} className="py-2">{event.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
          {selectedEventId && (
            <button
              onClick={() => onEventChange('')}
              className="absolute right-8 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
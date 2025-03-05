import { Event } from '../types';

interface Props {
  events: Event[];
  selectedEventId: number | '';
  onEventChange: (eventId: number | '') => void;
}

export default function EventFilter({ events, selectedEventId, onEventChange }: Props) {
  return (
    <div className="mb-6 bg-white p-4 rounded-xl shadow-md border border-gray-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center">
          <div className="bg-[#007BFF]/10 p-2 rounded-lg mr-3">
            <svg className="w-5 h-5 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-[#343A40]">Filter Entries</h3>
        </div>
        
        <div className="flex-grow sm:max-w-xs">
          <select
            value={selectedEventId}
            onChange={(e) => onEventChange(e.target.value ? Number(e.target.value) : '')}
            className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#007BFF]/30 focus:border-[#007BFF] transition-all text-black"
          >
            <option value="" className="text-black">All Events</option>
            {events.map(event => (
              <option key={event.id} value={event.id} className="text-black">
                {event.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
import { Event } from '../types';

interface Props {
  events: Event[];
  selectedEventId: number | '';
  onEventChange: (eventId: number | '') => void;
}

export default function EventFilter({ events, selectedEventId, onEventChange }: Props) {
  return (
    <div className="mb-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="text-lg font-semibold text-[#343A40] mb-1">Filter Entries</h3>
          <p className="text-sm text-[#6C757D]">Select an event to filter the entries</p>
        </div>
        
        <div className="relative w-full md:w-64">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-[#007BFF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
          </div>
          <select
            value={selectedEventId}
            onChange={(e) => onEventChange(e.target.value ? Number(e.target.value) : '')}
            className="w-full pl-10 p-3 border border-gray-200 rounded-lg bg-white text-[#343A40] hover:border-[#007BFF] focus:border-[#007BFF] focus:ring-2 focus:ring-[#007BFF]/20 transition-all appearance-none"
          >
            <option value="">All Events</option>
            {events.map(event => (
              <option 
                key={event.id} 
                value={event.id}
              >
                {event.name}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
            <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
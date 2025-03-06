'use client';

import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import MoiEntriesExport from '../components/MoiEntriesExport';
import MaterialEntriesExport from '../components/MaterialEntriesExport';
import FinanceExport from '../components/FinanceExport';
import EventDataVisualizer from '../components/EventDataVisualizer';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}

export default function ExportPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching events');
        console.error('Error fetching events:', err);
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#007BFF] mb-4"></div>
          <p className="text-black font-medium">Loading data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-16">
        <div className="min-h-screen bg-gradient-to-br from-[#FAE9D5] to-[#E5D1B8] py-4 sm:py-6 md:py-8">
          <div className="container mx-auto px-3 sm:px-4 max-w-7xl pr-4">
            <div className="flex flex-wrap items-center justify-start gap-4 mb-6 sm:mb-8 md:mb-10">
              <div className="bg-[#007BFF]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-black">Export Data</h1>
                <p className="text-sm sm:text-base text-black mt-1">Generate reports and export data</p>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-black">Select Event</h2>
              <select
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={selectedEventId || ''}
                onChange={(e) => setSelectedEventId(e.target.value ? Number(e.target.value) : null)}
              >
                <option value="">Select an event</option>
                {events.map((event) => (
                  <option key={event.id} value={event.id}>
                    {event.name} - {new Date(event.date).toLocaleDateString()}
                  </option>
                ))}
              </select>
            </div>

            {selectedEventId && (
              <>
                <div className="grid grid-cols-1 gap-6 mb-6">
                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-black">Moi Entries Export</h2>
                    <MoiEntriesExport eventId={selectedEventId} />
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-black">Material Entries Export</h2>
                    <MaterialEntriesExport eventId={selectedEventId} />
                  </div>

                  <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold mb-4 text-black">Finance Export</h2>
                    <FinanceExport eventId={selectedEventId} />
                  </div>
                </div>
                
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4 text-black">Data Visualization</h2>
                  <EventDataVisualizer eventId={selectedEventId} />
                </div>
              </>
            )}

            {error && (
              <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 text-black">
                <p>{error}</p>
              </div>
            )}

            <footer className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 text-center text-black text-xs sm:text-sm">
              <p>© {new Date().getFullYear()} MoyTech. All rights reserved.</p>
            </footer>
          </div>
        </div>
      </div>
    </div>
  );
}
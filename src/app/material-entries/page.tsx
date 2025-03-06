'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MoiEntryForm from './components/MoiEntryForm';
import EventFilter from './components/EventFilter';
import MoiEntriesTable from './components/MoiEntriesTable';
import { MoiEntry, Event } from './types';
import Sidebar from '../components/Sidebar';

// Create a client-only wrapper component
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default function MoiEntries() {
  const [moiEntries, setMoiEntries] = useState<MoiEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEntry, setEditingEntry] = useState<MoiEntry | null>(null);
  const [formData, setFormData] = useState({
    contributor_name: '',
    amount: '',
    notes: '',
    place: '',
    event_id: ''
  });
  const handleSubmit = async (formData: any) => {
    try {
      const url = editingEntry 
        ? `http://localhost:3000/api/moyentries/${editingEntry.id}`
        : 'http://localhost:3000/api/moyentries';
      
      const response = await fetch(url, {
        method: editingEntry ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          date: new Date().toISOString() // Add current date/time
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }

      // Refresh the entries list
      const fetchUrl = selectedEventId 
        ? `http://localhost:3000/api/moyentries/event/${selectedEventId}`
        : 'http://localhost:3000/api/moyentries';
        
      const updatedResponse = await fetch(fetchUrl);
      const updatedData = await updatedResponse.json();
      setMoiEntries(updatedData);
      setEditingEntry(null);
    } catch (err) {
      setError('Error submitting entry');
      console.error('Error submitting entry:', err);
    }
  };
  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/moyentries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Refresh the entries list after deletion
      const fetchUrl = selectedEventId 
        ? `http://localhost:3000/api/moyentries/event/${selectedEventId}`
        : 'http://localhost:3000/api/moyentries';
        
      const updatedResponse = await fetch(fetchUrl);
      const updatedData = await updatedResponse.json();
      setMoiEntries(updatedData);
    } catch (err) {
      setError('Error deleting entry');
      console.error('Error deleting entry:', err);
    }
  };
  // Update the main useEffect
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3000/api/events');
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        const data = await response.json();
        setEvents(data);
      } catch (err) {
        setError('Error fetching events');
        console.error('Error fetching events:', err);
      }
    };
    fetchEvents();
    
    const fetchMoiEntries = async (eventId: number | '') => {
      try {
        const url = eventId 
          ? `http://localhost:3000/api/moyentries/event/${eventId}`
          : 'http://localhost:3000/api/moyentries';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch moi entries');
        }
        const data = await response.json();
        setMoiEntries(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching moi entries');
        console.error('Error fetching moi entries:', err);
        setLoading(false);
      }
    };

    fetchMoiEntries(selectedEventId);
  }, [selectedEventId]);
  // Loading state remains the same
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#007BFF] mb-4"></div>
          <p className="text-[#6C757D] font-medium">Loading data...</p>
        </div>
      </div>
    );
  }
  
  return (
    <ClientOnly>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16">
          <div className="min-h-screen bg-gradient-to-br from-[#E8F4FF] to-[#F8FBFF] py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 max-w-7xl pr-4">
              <div className="flex flex-wrap items-center justify-start gap-4 mb-6 sm:mb-8 md:mb-10">
                <div className="bg-[#0066CC]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#0066CC]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#1A1A1A]">Moi Entries</h1>
                  <p className="text-sm sm:text-base text-[#4D4D4D] mt-1">Manage and track all contributions</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                <div className="xl:col-span-4 xl:order-2 mb-6 xl:mb-0">
                  <div className="xl:sticky xl:top-4 xl:max-h-screen xl:overflow-visible">
                    <div className="bg-gradient-to-br from-white to-[#F0F7FF] p-1 rounded-xl shadow-lg">
                      <MoiEntryForm 
                        events={events}
                        onSubmit={handleSubmit}
                        editingEntry={editingEntry}
                      />
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-8 xl:order-1">
                  <EventFilter
                    events={events}
                    selectedEventId={selectedEventId}
                    onEventChange={setSelectedEventId}
                  />

                  <div className="w-full overflow-hidden shadow-md rounded-lg">
                    <MoiEntriesTable
                      entries={moiEntries}
                      onEdit={(entry) => setEditingEntry(entry)}
                      onDelete={handleDelete}
                    />
                  </div>

                  {/* Responsive error message */}
                  {error && (
                    <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#FF3B30]/10 border-l-4 border-[#FF3B30] rounded-md flex items-center">
                      <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#FF3B30] mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm sm:text-base text-[#FF3B30] font-medium">{error}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Responsive footer */}
              <footer className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 text-center text-[#4D4D4D] text-xs sm:text-sm">
                <p>© {new Date().getFullYear()} MoyTech. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
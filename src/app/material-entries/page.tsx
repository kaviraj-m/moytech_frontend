'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import MaterialEntryForm from './components/MaterialEntryForm';
import EventFilter from './components/EventFilter';
import MaterialEntriesTable from './components/MaterialEntriesTable';
import { MaterialEntry, Event } from './types';

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

export default function MaterialEntries() {
  const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEntry, setEditingEntry] = useState<MaterialEntry | null>(null);
  const [formData, setFormData] = useState({
    contributor_name: '',
    material_type: '',
    weight: '',
    description: '',
    place: '',
    event_id: ''
  });

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingEntry 
        ? `http://localhost:3000/api/materialentries/${editingEntry.id}`
        : 'http://localhost:3000/api/materialentries';
      
      const response = await fetch(url, {
        method: editingEntry ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit entry');
      }

      // Refresh the entries list
      const fetchUrl = selectedEventId 
        ? `http://localhost:3000/api/materialentries/event/${selectedEventId}`
        : 'http://localhost:3000/api/materialentries';
        
      const updatedResponse = await fetch(fetchUrl);
      const updatedData = await updatedResponse.json();
      setMaterialEntries(updatedData);
      setEditingEntry(null);
    } catch (err) {
      setError('Error submitting entry');
      console.error('Error submitting entry:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/materialentries/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Refresh the entries list after deletion
      const fetchUrl = selectedEventId 
        ? `http://localhost:3000/api/materialentries/event/${selectedEventId}`
        : 'http://localhost:3000/api/materialentries';
        
      const updatedResponse = await fetch(fetchUrl);
      const updatedData = await updatedResponse.json();
      setMaterialEntries(updatedData);
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
    
    const fetchMaterialEntries = async (eventId: number | '') => {
      try {
        const url = eventId 
          ? `http://localhost:3000/api/materialentries/event/${eventId}`
          : 'http://localhost:3000/api/materialentries';
        
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Failed to fetch material entries');
        }
        const data = await response.json();
        setMaterialEntries(data);
        setLoading(false);
      } catch (err) {
        setError('Error fetching material entries');
        console.error('Error fetching material entries:', err);
        setLoading(false);
      }
    };

    fetchMaterialEntries(selectedEventId);
  }, [selectedEventId]);

  // Loading state
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
      <div className="min-h-screen bg-[#F8F9FA] py-4 sm:py-6 md:py-8">
        <div className="container mx-auto px-3 sm:px-4 max-w-7xl">
          {/* Responsive header with flex-wrap for small screens */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-[#007BFF]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#343A40]">Material Entries</h1>
                <p className="text-sm sm:text-base text-[#6C757D] mt-1">Manage and track all material contributions</p>
              </div>
            </div>
            <div className="px-5 py-3 bg-[#007BFF]/20 rounded-lg shadow-sm border border-[#007BFF]/30">
              <p className="text-base sm:text-lg text-[#343A40] font-extrabold flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Contact: <span className="text-[#007BFF]">7339193757</span>
              </p>
            </div>
          </div>

          {/* Mobile-first layout with reversed order on small screens */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Form section - appears first on mobile, right side on desktop */}
            <div className="xl:col-span-4 xl:order-2 mb-6 xl:mb-0">
              <div className="xl:sticky xl:top-4 xl:max-h-screen xl:overflow-visible">
                <div className="bg-gradient-to-br from-[#007BFF]/5 to-[#007BFF]/10 p-1 rounded-xl">
                  <MaterialEntryForm 
                    events={events}
                    onSubmit={handleSubmit}
                    editingEntry={editingEntry}
                  />
                </div>
              </div>
            </div>

            {/* Table section - appears second on mobile, left side on desktop */}
            <div className="xl:col-span-8 xl:order-1">
              <EventFilter
                events={events}
                selectedEventId={selectedEventId}
                onEventChange={setSelectedEventId}
              />

              <div className="w-full overflow-hidden shadow-md rounded-lg">
                <MaterialEntriesTable
                  entries={materialEntries}
                  onEdit={(entry) => setEditingEntry(entry)}
                  onDelete={handleDelete}
                />
              </div>

              {/* Responsive error message */}
              {error && (
                <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-[#DC3545]/10 border-l-4 border-[#DC3545] rounded-md flex items-center">
                  <svg className="h-4 w-4 sm:h-5 sm:w-5 text-[#DC3545] mr-2 sm:mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm sm:text-base text-[#DC3545] font-medium">{error}</p>
                </div>
              )}
            </div>
          </div>

          {/* Responsive footer */}
          <footer className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 text-center text-[#6C757D] text-xs sm:text-sm">
            <p>© {new Date().getFullYear()} MoyTech. All rights reserved.</p>
          </footer>
        </div>
      </div>
    </ClientOnly>
  );
}
'use client';

import { useState, useEffect } from 'react';
import { Event } from './types';
import Sidebar from '../components/Sidebar';
import ClientOnly from '../components/ClientOnly';
import EventForm from './components/EventForm';
import EventsTable from './components/EventsTable';

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  useEffect(() => {
    fetchEvents();
  }, []);

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

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingEvent 
        ? `http://localhost:3000/api/events/${editingEvent.id}`
        : 'http://localhost:3000/api/events';
      
      const response = await fetch(url, {
        method: editingEvent ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to submit event');
      }

      fetchEvents();
      setEditingEvent(null);
    } catch (err) {
      setError('Error submitting event');
      console.error('Error submitting event:', err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/events/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }

      fetchEvents();
    } catch (err) {
      setError('Error deleting event');
      console.error('Error deleting event:', err);
    }
  };

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
          <div className="min-h-screen bg-gradient-to-br from-[#FAE9D5] to-[#E5D1B8] py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 max-w-7xl pr-4">
              <div className="flex flex-wrap items-center justify-start gap-4 mb-6 sm:mb-8 md:mb-10">
                <div className="bg-[#007BFF]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                  <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#343A40]">Events</h1>
                  <p className="text-sm sm:text-base text-[#6C757D] mt-1">Manage all events</p>
                </div>
              </div>

              <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
                <div className="xl:col-span-4 xl:order-2 mb-6 xl:mb-0">
                  <div className="xl:sticky xl:top-4 xl:max-h-screen xl:overflow-visible">
                    <div className="bg-gradient-to-br from-[#007BFF]/5 to-[#007BFF]/10 p-1 rounded-xl">
                      <EventForm 
                        onSubmit={handleSubmit}
                        editingEvent={editingEvent}
                      />
                    </div>
                  </div>
                </div>

                <div className="xl:col-span-8 xl:order-1">
                  <div className="w-full overflow-hidden shadow-md rounded-lg">
                    <EventsTable
                      events={events}
                      onEdit={(event) => setEditingEvent(event)}
                      onDelete={handleDelete}
                    />
                  </div>

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

              <footer className="mt-8 sm:mt-12 md:mt-16 pt-4 sm:pt-6 md:pt-8 border-t border-gray-200 text-center text-[#6C757D] text-xs sm:text-sm">
                <p>© {new Date().getFullYear()} MoyTech. All rights reserved.</p>
              </footer>
            </div>
          </div>
        </div>
      </div>
    </ClientOnly>
  );
}
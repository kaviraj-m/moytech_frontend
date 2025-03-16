'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TamilExportButton from '@/app/components/TamilExportButton';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}

export default function TamilExportPage() {
  const params = useParams();
  const eventId = Number(params.eventId);
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEventDetails() {
      try {
        // Use the correct API endpoint for events
        const response = await fetch(`/api/events/details/${eventId}`);
        
        if (!response.ok) {
          console.error('API response not OK:', response.status, response.statusText);
          throw new Error(`Failed to fetch event details: ${response.status}`);
        }
        
        const eventData = await response.json();
        setEvent(eventData);
      } catch (error) {
        console.error('Error fetching event details:', error);
      } finally {
        setLoading(false);
      }
    }

    if (eventId) {
      fetchEventDetails();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>Event not found or error loading event details.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white shadow-md rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Tamil Export - {event.name}</h1>
        
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-2">Event Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-md">
            <div>
              <p><span className="font-medium">Event Name:</span> {event.name}</p>
              <p><span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div>
              <p><span className="font-medium">Location:</span> {event.location}</p>
              <p><span className="font-medium">Event Type:</span> {event.event_type}</p>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-gray-700 mb-4">
            Click the button below to generate a PDF with MOY entries translated to Tamil.
            This process may take a few moments as each entry needs to be translated.
          </p>
          
          <TamilExportButton 
            eventId={eventId} 
            eventDetails={{
              name: event.name,
              date: event.date,
              location: event.location,
              event_type: event.event_type
            }} 
          />
        </div>
      </div>
    </div>
  );
}
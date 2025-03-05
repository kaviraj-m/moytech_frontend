'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}

interface EventSummary {
  event: Event;
  moiCount: number;
  materialCount: number;
  financeSummary: {
    total_income: number;
    total_expense: number;
    balance: number;
  };
}

export default function Dashboard() {
  const [events, setEvents] = useState<EventSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEventSummaries = async () => {
      try {
        const eventsResponse = await fetch('http://localhost:3000/api/events');
        const eventsData = await eventsResponse.json();

        const summaries = await Promise.all(
          eventsData.map(async (event: Event) => {
            const [moiResponse, materialResponse, financeResponse] = await Promise.all([
              fetch(`http://localhost:3000/api/moyentries/event/${event.id}`),
              fetch(`http://localhost:3000/api/materialentries/event/${event.id}`),
              fetch(`http://localhost:3000/api/finance/event/${event.id}`)
            ]);

            const moiData = await moiResponse.json();
            const materialData = await materialResponse.json();
            const financeData = await financeResponse.json();

            return {
              event,
              moiCount: Array.isArray(moiData) ? moiData.length : 0,
              materialCount: Array.isArray(materialData) ? materialData.length : 0,
              financeSummary: {
                total_income: financeData.total_income || 0,
                total_expense: financeData.total_expense || 0,
                balance: financeData.balance || 0
              }
            };
          })
        );

        setEvents(summaries);
      } catch (err) {
        setError('Failed to fetch event data');
      } finally {
        setLoading(false);
      }
    };

    fetchEventSummaries();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Event Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((eventSummary) => (
          <div key={eventSummary.event.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">{eventSummary.event.name}</h2>
            <div className="space-y-2">
              <p><span className="font-medium">Date:</span> {new Date(eventSummary.event.date).toLocaleDateString()}</p>
              <p><span className="font-medium">Location:</span> {eventSummary.event.location}</p>
              <p><span className="font-medium">Type:</span> {eventSummary.event.event_type}</p>
              <div className="border-t pt-2 mt-4">
                <p><span className="font-medium">Moi Entries:</span> {eventSummary.moiCount}</p>
                <p><span className="font-medium">Material Entries:</span> {eventSummary.materialCount}</p>
                <div className="mt-2">
                  <p><span className="font-medium">Total Income:</span> ₹{eventSummary.financeSummary.total_income.toFixed(2)}</p>
                  <p><span className="font-medium">Total Expense:</span> ₹{eventSummary.financeSummary.total_expense.toFixed(2)}</p>
                  <p className="font-semibold">Balance: ₹{eventSummary.financeSummary.balance.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
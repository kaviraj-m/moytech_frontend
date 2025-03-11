'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import FinanceEntryForm from './components/FinanceEntryForm';
import EventFilter from './components/EventFilter';
import FinanceEntriesTable from './components/FinanceEntriesTable';
import { FinanceEntry, Event } from './types';
import Sidebar from '../components/Sidebar';
import ClientOnly from '../components/ClientOnly';
import AuthCheck from '../components/AuthCheck';



export default function Finance() {
  const [financeEntries, setFinanceEntries] = useState<FinanceEntry[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingEntry, setEditingEntry] = useState<FinanceEntry | null>(null);
  const [summary, setSummary] = useState({
    total_income: 0,
    total_expense: 0,
    balance: 0
  });

  const handleSubmit = async (formData: any) => {
    try {
      const url = editingEntry 
        ? `http://localhost:3000/api/finance/${editingEntry.id}`
        : `http://localhost:3000/api/finance/${formData.type.toLowerCase()}`;
      
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

      // Refresh the entries list and summary
      await fetchFinanceData(selectedEventId);
      setEditingEntry(null);
    } catch (err) {
      setError('Error submitting entry');
      console.error('Error submitting entry:', err);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3000/api/finance/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete entry');
      }

      // Refresh the entries list and summary
      await fetchFinanceData(selectedEventId);
    } catch (err) {
      setError('Error deleting entry');
      console.error('Error deleting entry:', err);
    }
  };

  const fetchFinanceData = async (eventId: number | '') => {
    try {
      if (eventId) {
        const response = await fetch(`http://localhost:3000/api/finance/event/${eventId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch finance data');
        }
        const data = await response.json();
        setFinanceEntries(data.entries ? data.entries.map((entry: any) => ({
          ...entry,
          amount: parseFloat(entry.amount)
        })) : []);
        setSummary({
          total_income: data.total_income,
          total_expense: data.total_expense,
          balance: data.balance
        });
      } else {
        const [entriesResponse, summaryResponse] = await Promise.all([
          fetch('http://localhost:3000/api/finance'),
          fetch('http://localhost:3000/api/finance/summary')
        ]);
        
        if (!entriesResponse.ok || !summaryResponse.ok) {
          throw new Error('Failed to fetch finance data');
        }

        const entries = await entriesResponse.json();
        const summaryData = await summaryResponse.json();

        setFinanceEntries(entries.map((entry: any) => ({
          ...entry,
          amount: parseFloat(entry.amount)
        })));
        setSummary({
          total_income: summaryData.total_income,
          total_expense: summaryData.total_expense,
          balance: summaryData.balance
        });
      }
      setLoading(false);
    } catch (err) {
      setError('Error fetching finance data');
      console.error('Error fetching finance data:', err);
      setLoading(false);
    }
  };

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
    fetchFinanceData(selectedEventId);
  }, [selectedEventId]);

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
    <AuthCheck>
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-16">
          <div className="min-h-screen bg-gradient-to-br from-[#FAE9D5] to-[#E5D1B8] py-4 sm:py-6 md:py-8">
            <div className="container mx-auto px-3 sm:px-4 max-w-7xl pr-4">
          {/* Responsive header with flex-wrap for small screens */}
          <div className="flex flex-wrap items-center justify-start gap-4 mb-6 sm:mb-8 md:mb-10">
            <div className="flex items-center gap-4">
              <div className="bg-[#007BFF]/10 p-2 sm:p-3 rounded-lg flex-shrink-0">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-[#007BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[#343A40]">Finance</h1>
                <p className="text-sm sm:text-base text-[#6C757D] mt-1">Manage income and expenses</p>
              </div>
            </div>

            {/* Summary Cards */}
            <div className="flex flex-wrap gap-4">
              <div className="px-5 py-3 bg-[#007BFF]/20 rounded-lg shadow-sm border border-[#007BFF]/30">
                <p className="text-base sm:text-lg text-[#343A40] font-extrabold flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Balance: <span className="text-[#007BFF]">₹{summary.balance.toFixed(2)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Mobile-first layout with reversed order on small screens */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-6 md:gap-8">
            {/* Form section - appears first on mobile, right side on desktop */}
            <div className="xl:col-span-4 xl:order-2 mb-6 xl:mb-0">
              <div className="xl:sticky xl:top-4 xl:max-h-screen xl:overflow-visible">
                <div className="bg-gradient-to-br from-[#007BFF]/5 to-[#007BFF]/10 p-1 rounded-xl">
                  <FinanceEntryForm 
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
                <FinanceEntriesTable
                  entries={financeEntries}
                  onEdit={(entry: FinanceEntry) => setEditingEntry(entry)}
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
        </div>
      </div>
    </AuthCheck>
  );
}
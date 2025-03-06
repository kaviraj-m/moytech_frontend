'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import ClientOnly from '../components/ClientOnly';
import MoiDistributionChart from '../components/charts/MoiDistributionChart';
import MaterialDistributionChart from '../components/charts/MaterialDistributionChart';
import FinanceChart from '../components/charts/FinanceChart';

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  event_type: string;
}

interface MoiEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  amount: number;
  notes: string;
  place: string;
  created_at: string;
  updated_at: string;
}

interface MaterialEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  material_type: string;
  weight: number;
  description: string;
  place: string;
  created_at: string;
  updated_at: string;
}

interface EventSummary {
  event: Event;
  moiEntries: MoiEntry[];
  materialEntries: MaterialEntry[];
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
              moiEntries: Array.isArray(moiData) ? moiData : [],
              materialEntries: Array.isArray(materialData) ? materialData : [],
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
                  <h1 className="text-2xl sm:text-3xl font-bold text-[#343A40]">Event Dashboard</h1>
                  <p className="text-sm sm:text-base text-[#6C757D] mt-1">View overall statistics and summaries</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((eventSummary) => (
                  <div key={eventSummary.event.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300">
                    <h2 className="text-xl font-semibold mb-4 text-[#343A40]">{eventSummary.event.name}</h2>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm text-[#495057]">
                        <div>
                          <p className="font-medium">Date</p>
                          <p>{new Date(eventSummary.event.date).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="font-medium">Location</p>
                          <p>{eventSummary.event.location}</p>
                        </div>
                        <div>
                          <p className="font-medium">Event Type</p>
                          <p>{eventSummary.event.event_type}</p>
                        </div>
                        <div>
                          <p className="font-medium">Status</p>
                          <p className="text-green-600">Active</p>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-blue-600 font-medium">Moi Entries</p>
                            <p className="text-2xl font-semibold text-blue-700">{eventSummary.moiEntries.length}</p>
                          </div>
                          <div className="bg-purple-50 p-3 rounded-lg">
                            <p className="text-purple-600 font-medium">Material Entries</p>
                            <p className="text-2xl font-semibold text-purple-700">{eventSummary.materialEntries.length}</p>
                          </div>
                        </div>

                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] font-medium">Total Income</span>
                            <span className="text-green-600 font-semibold">₹{eventSummary.financeSummary.total_income.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-[#495057] font-medium">Total Expense</span>
                            <span className="text-red-600 font-semibold">₹{eventSummary.financeSummary.total_expense.toFixed(2)}</span>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                            <span className="text-[#495057] font-medium">Balance</span>
                            <span className="text-lg font-bold text-blue-600">₹{eventSummary.financeSummary.balance.toFixed(2)}</span>
                          </div>
                        </div>
                      </div>

                      <div className="mt-6 space-y-6">
                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-4 text-[#343A40]">Financial Overview</h3>
                          <div className="h-[300px]">
                            <FinanceChart
                              income={eventSummary.financeSummary.total_income}
                              expense={eventSummary.financeSummary.total_expense}
                              eventName={eventSummary.event.name}
                            />
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-4 text-[#343A40]">Moi Distribution</h3>
                          <div className="h-[300px]">
                            <MoiDistributionChart 
                              entries={eventSummary.moiEntries} 
                              eventName={eventSummary.event.name} 
                            />
                          </div>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md">
                          <h3 className="text-lg font-semibold mb-4 text-[#343A40]">Material Distribution</h3>
                          <div className="h-[300px]">
                            <MaterialDistributionChart
                              materials={eventSummary.materialEntries}
                              eventName={eventSummary.event.name}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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
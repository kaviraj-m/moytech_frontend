'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import { translateToTamil } from '@/utils/translateToTamil';

interface MoyEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  amount: number;
  notes: string;
  place: string;
  created_at: string;
  updated_at: string;
}

interface TamilExportButtonProps {
  eventId: number;
  eventDetails?: {
    name: string;
    date: string;
    location: string;
    event_type: string;
  };
}

export default function TamilExportButton({ eventId, eventDetails }: TamilExportButtonProps) {
  const [isLoading, setLoading] = useState(false);

  const exportTamilExcel = async () => {
    try {
      setLoading(true);
      
      // Fetch MOY entries for the event
      const response = await fetch(`/api/moyentries/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch MOY entries');
      }
      
      const moyEntries: MoyEntry[] = await response.json();
      
      // Translate entries to Tamil
      const translatedEntries = await Promise.all(
        moyEntries.map(async (entry) => {
          console.log('Translating entry:', entry.contributor_name);
          
          // Add more detailed logging for translation process
          let translatedName, translatedNotes, translatedPlace;
          
          try {
            translatedName = await translateToTamil(entry.contributor_name);
            console.log('Translated name:', translatedName);
          } catch (error) {
            console.error('Error translating name:', error);
            translatedName = entry.contributor_name;
          }
          
          try {
            translatedNotes = await translateToTamil(entry.notes);
            console.log('Translated notes:', translatedNotes);
          } catch (error) {
            console.error('Error translating notes:', error);
            translatedNotes = entry.notes;
          }
          
          try {
            translatedPlace = await translateToTamil(entry.place);
            console.log('Translated place:', translatedPlace);
          } catch (error) {
            console.error('Error translating place:', error);
            translatedPlace = entry.place;
          }
          
          return {
            ...entry,
            contributor_name_tamil: translatedName,
            notes_tamil: translatedNotes,
            place_tamil: translatedPlace,
          };
        })
      );
      
      // Prepare data for Excel export - simplified to only include Tamil translations
      const excelData = translatedEntries.map(entry => ({
        'Name': entry.contributor_name_tamil,
        'Amount': entry.amount,
        'Notes': entry.notes_tamil,
        'Place': entry.place_tamil
      }));
      
      // Calculate total amount
      const totalAmount = translatedEntries.reduce((sum, entry) => {
        const amount = typeof entry.amount === 'string' 
          ? parseFloat(entry.amount) 
          : (typeof entry.amount === 'number' ? entry.amount : 0);
        
        return sum + (isNaN(amount) ? 0 : amount);
      }, 0);
      
      // Add total row
      excelData.push({
        'Name': 'Total',
        'Amount': totalAmount,
        'Notes': '',
        'Place': ''
      });
      
      // Create workbook and worksheet
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Tamil Translations');
      
      // Generate Excel file
      XLSX.writeFile(wb, `MOY_Entries_Tamil_Event_${eventId}.xlsx`);
    } catch (error) {
      console.error('Error generating Tamil Excel:', error);
      alert('Failed to generate Tamil Excel. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  const handleExport = async () => {
    try {
      await exportTamilExcel();
    } catch (error) {
      console.error('Error exporting Tamil Excel:', error);
      alert('Failed to generate Tamil Excel. Please try again.');
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={isLoading}
        className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out
          ${isLoading ? 'bg-gray-300 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-md'}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Translating & Exporting...
          </>
        ) : (
          <>
            <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
            </svg>
            Export Tamil Excel
          </>
        )}
      </button>
    </div>
  );
}
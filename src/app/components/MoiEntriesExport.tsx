'use client';

import { useState } from 'react';
import ExportButton from './ExportButton';

interface MoiEntriesExportProps {
  eventId: number;
}

interface MoiEntry {
  id: number;
  event_id: number;
  contributor_name: string;
  amount: string | number;
  notes: string;
  place: string;
  created_at: string;
  updated_at: string;
}

export default function MoiEntriesExport({ eventId }: MoiEntriesExportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enableTamilTranslation, setEnableTamilTranslation] = useState(false);

  const columns = [
    { header: 'Contributor Name', accessor: 'contributor_name' },
    { header: 'Amount', accessor: 'amount' },
    { header: 'Notes', accessor: 'notes' },
    { header: 'Place', accessor: 'place' },
    { header: 'Date', accessor: 'created_at' }
  ];

  const fetchAndExport = async (variant: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/api/moyentries/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch moi entries');
      }

      const data: MoiEntry[] = await response.json();
      const formattedData = data.map(entry => ({
        ...entry,
        amount: Number(entry.amount).toFixed(2),
        created_at: new Date(entry.created_at).toLocaleDateString('en-IN')
      }));

      return formattedData;
    } catch (err) {
      setError('Error fetching moi entries for export');
      console.error('Error fetching moi entries:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
          <input
            type="checkbox"
            checked={enableTamilTranslation}
            onChange={(e) => setEnableTamilTranslation(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span>Enable Tamil Translation for Excel & PDF</span>
        </label>
      </div>
      
      <div className="space-x-2 flex items-center">
        <ExportButton
          data={[]}
          columns={columns}
          fileName={`moi-entries-event-${eventId}`}
          variant="excel"
          onExport={fetchAndExport}
          loading={loading}
          enableTamilTranslation={enableTamilTranslation}
        />
        <ExportButton
          data={[]}
          columns={columns}
          fileName={`moi-entries-event-${eventId}`}
          variant="pdf"
          onExport={fetchAndExport}
          loading={loading}
          enableTamilTranslation={enableTamilTranslation}
        />
        {error && (
          <p className="mt-2 text-sm text-red-600">{error}</p>
        )}
      </div>
    </div>
  );
}
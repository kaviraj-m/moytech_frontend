'use client';

import { useState } from 'react';
import ExportButton from './ExportButton';

interface MaterialEntriesExportProps {
  eventId: number;
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

export default function MaterialEntriesExport({ eventId }: MaterialEntriesExportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const columns = [
    { header: 'Contributor Name', accessor: 'contributor_name' },
    { header: 'Material Type', accessor: 'material_type' },
    { header: 'Weight', accessor: 'weight' },
    { header: 'Description', accessor: 'description' },
    { header: 'Place', accessor: 'place' },
    { header: 'Date', accessor: 'created_at' }
  ];

  const fetchAndExport = async (variant: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/api/materialentries/event/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch material entries');
      }

      const data: MaterialEntry[] = await response.json();
      const formattedData = data.map(entry => ({
        ...entry,
        weight: entry.weight.toFixed(3),
        created_at: new Date(entry.created_at).toLocaleDateString('en-IN')
      }));

      return formattedData;
    } catch (err) {
      setError('Error fetching material entries for export');
      console.error('Error fetching material entries:', err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-x-2 flex items-center">
      <ExportButton
        data={[]}
        columns={columns}
        fileName={`material-entries-event-${eventId}`}
        variant="excel"
        onExport={fetchAndExport}
        loading={loading}
      />
      <ExportButton
        data={[]}
        columns={columns}
        fileName={`material-entries-event-${eventId}`}
        variant="pdf"
        onExport={fetchAndExport}
        loading={loading}
      />
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
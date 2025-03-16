'use client';

import { useState } from 'react';
import ExportButton from './ExportButton';

interface FinanceExportProps {
  eventId: number;
}

interface FinanceEntry {
  id: number;
  event_id: number;
  type: 'INCOME' | 'EXPENSE';
  amount: number;
  description: string;
  date: string;
  category: string;
}

interface FinanceSummary {
  event_id: string;
  total_income: number;
  total_expense: number;
  balance: number;
  income_entries: FinanceEntry[];
  expense_entries: FinanceEntry[];
}

export default function FinanceExport({ eventId }: FinanceExportProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [enableTamilTranslation, setEnableTamilTranslation] = useState(false);

  const incomeColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Category', accessor: 'category' },
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' }
  ];

  const expenseColumns = [
    { header: 'Date', accessor: 'date' },
    { header: 'Category', accessor: 'category' },
    { header: 'Description', accessor: 'description' },
    { header: 'Amount', accessor: 'amount' }
  ];

  const fetchAndExport = async (variant: 'pdf' | 'excel') => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch(`http://localhost:3000/api/finance/detailed-summary/${eventId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch finance data');
      }

      const data: FinanceSummary = await response.json();
      
      const formattedIncomeEntries = data.income_entries.map(entry => ({
        ...entry,
        amount: Number(entry.amount).toFixed(2),
        date: new Date(entry.date).toLocaleDateString('en-IN')
      }));

      const formattedExpenseEntries = data.expense_entries.map(entry => ({
        ...entry,
        amount: Number(entry.amount).toFixed(2),
        date: new Date(entry.date).toLocaleDateString('en-IN')
      }));

      if (variant === 'pdf') {
        return {
          income: formattedIncomeEntries,
          expense: formattedExpenseEntries,
          summary: {
            total_income: Number(data.total_income).toFixed(2),
            total_expense: Number(data.total_expense).toFixed(2),
            balance: Number(data.balance).toFixed(2)
          }
        };
      } else {
        return {
          income: formattedIncomeEntries,
          expense: formattedExpenseEntries
        };
      }
    } catch (err) {
      setError('Error fetching finance data for export');
      console.error('Error fetching finance data:', err);
      return { income: [], expense: [] };
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
          columns={{
            income: incomeColumns,
            expense: expenseColumns
          }}
          fileName={`finance-report-event-${eventId}`}
          variant="excel"
          onExport={fetchAndExport}
          loading={loading}
          enableTamilTranslation={enableTamilTranslation}
        />
        <ExportButton
          data={[]}
          columns={{
            income: incomeColumns,
            expense: expenseColumns
          }}
          fileName={`finance-report-event-${eventId}`}
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
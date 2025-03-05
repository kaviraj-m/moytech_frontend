import { useState } from 'react';
import { MoiEntry } from '../types';

interface Props {
  entries: MoiEntry[];
  onEdit: (entry: MoiEntry) => void;
  onDelete: (id: number) => void;
}

export default function MoiEntriesTable({ entries, onEdit, onDelete }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [entryToDelete, setEntryToDelete] = useState<number | null>(null);
  
  // Format date properly to avoid "Invalid Date" issues
  const formatDate = (dateString: string) => {
    try {
      if (!dateString) return 'N/A';
      
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      
      return date.toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };
  const handleDeleteClick = (id: number) => {
    setEntryToDelete(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (entryToDelete !== null) {
      onDelete(entryToDelete);
      setShowDeleteConfirm(false);
      setEntryToDelete(null);
    }
  };
  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg overflow-hidden border border-gray-100">
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full animate-fade-in">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#DC3545]/10 mb-6">
                <svg className="h-8 w-8 text-[#DC3545]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#343A40] mb-2">Delete Entry</h3>
              <p className="text-[#6C757D] mb-8">
                Are you sure you want to delete this entry? This action cannot be undone.
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-5 py-2.5 bg-white border border-[#6C757D] text-[#6C757D] rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-5 py-2.5 bg-[#DC3545] text-white rounded-lg hover:bg-[#DC3545]/90 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-[#007BFF]/5 to-[#007BFF]/10">
            <tr>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Contributor
              </th>
              <th className="w-[12%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Amount
              </th>
              <th className="w-[23%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Notes
              </th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Place
              </th>
              <th className="w-[20%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Date & Time
              </th>
              <th className="w-[15%] px-6 py-4 text-left text-xs font-semibold text-[#343A40] uppercase tracking-wider border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {entries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-[#6C757D]">
                  No entries found
                </td>
              </tr>
            ) : (
              entries.map((entry) => (
                <tr key={entry.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="px-6 py-5 text-sm text-[#343A40]">
                    {entry.contributor_name}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-[#28A745]">
                    {formatCurrency(entry.amount)}
                  </td>
                  <td className="px-6 py-5 text-sm text-[#343A40] truncate">
                    {entry.notes || '-'}
                  </td>
                  <td className="px-6 py-5 text-sm text-[#343A40]">
                    {entry.place || '-'}
                  </td>
                  <td className="px-6 py-5 text-sm text-[#343A40]">
                    {formatDate(entry.created_at)}
                  </td>
                  <td className="px-6 py-5 text-sm font-medium">
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => onEdit(entry)}
                        className="inline-flex items-center px-3 py-2 bg-[#007BFF] text-white rounded-md hover:bg-[#007BFF]/90 transition-all duration-200 hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(entry.id)}
                        className="inline-flex items-center px-3 py-2 bg-white border border-[#DC3545] text-[#DC3545] rounded-md hover:bg-[#DC3545] hover:text-white transition-all duration-200 hover:shadow-md"
                      >
                        <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
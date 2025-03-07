'use client';

import { useState } from 'react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import autoTable from 'jspdf-autotable';

const formatAmount = (amount: number | string) => {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount.replace(/[^0-9.-]+/g, '')) : amount;
  return numericAmount.toFixed(2);
};

interface Column {
  header: string;
  accessor: string;
}

interface ExportButtonProps {
  data: any[];
  columns: Column[] | { income: Column[]; expense: Column[] };
  fileName: string;
  variant?: 'pdf' | 'excel';
  onExport?: (variant: 'pdf' | 'excel') => Promise<any>;
  loading?: boolean;
  eventDetails?: {
    name: string;
    date: string;
    location: string;
    event_type: string;
  };
}

export default function ExportButton({ data, columns, fileName, variant = 'excel', onExport, loading, eventDetails }: ExportButtonProps) {
  const [isLoading, setLoading] = useState(false);

  const exportToExcel = async () => {
    try {
      setLoading(true);
      const exportData = onExport ? await onExport('excel') : data;

      if ('income' in columns) {
        // Handle finance report with multiple sheets
        const wb = XLSX.utils.book_new();

        // Income sheet
        const incomeData = exportData.income.map((item: any) => {
          const row: any = {};
          columns.income.forEach(col => {
            row[col.header] = col.accessor === 'amount' ? formatAmount(item[col.accessor]) : item[col.accessor];
          });
          return row;
        });
        const totalIncome = incomeData.reduce((sum: number, item: { Amount: string }) => sum + parseFloat(item['Amount']), 0);
        incomeData.push({ Date: 'Total', Category: '', Description: '', Amount: formatAmount(totalIncome) });
        const incomeWs = XLSX.utils.json_to_sheet(incomeData);
        XLSX.utils.book_append_sheet(wb, incomeWs, 'Income');

        // Expense sheet
        const expenseData = exportData.expense.map((item: any) => {
          const row: any = {};
          columns.expense.forEach(col => {
            row[col.header] = col.accessor === 'amount' ? formatAmount(item[col.accessor]) : item[col.accessor];
          });
          return row;
        });
        const totalExpense = expenseData.reduce((sum: number, item: { Amount: string }) => sum + parseFloat(item['Amount']), 0);
        expenseData.push({ Date: 'Total', Category: '', Description: '', Amount: formatAmount(totalExpense) });
        const expenseWs = XLSX.utils.json_to_sheet(expenseData);
        XLSX.utils.book_append_sheet(wb, expenseWs, 'Expenses');

        XLSX.writeFile(wb, `${fileName}.xlsx`);
      } else {
        // Handle single sheet export
        const tableData = exportData.map((item: any) => {
          const row: any = {};
          columns.forEach(col => {
            row[col.header] = col.accessor === 'amount' ? formatAmount(item[col.accessor]) : item[col.accessor];
          });
          return row;
        });
        const total = tableData.reduce((sum: number, item: Record<string, any>) => {
          const amount = item['Amount'] ? parseFloat(item['Amount']) : 0;
          return sum + amount;
        }, 0);
        tableData.push({ [columns[0].header]: 'Total', [columns[columns.length - 1].header]: formatAmount(total) });
        const ws = XLSX.utils.json_to_sheet(tableData);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
        XLSX.writeFile(wb, `${fileName}.xlsx`);
      }
    } catch (error) {
      console.error('Error exporting to Excel:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportToPDF = async () => {
    try {
      setLoading(true);
      const exportData = onExport ? await onExport('pdf') : data;
      const doc = new jsPDF();

      // Add enhanced event details if available
      if (eventDetails) {
        // Create a colored header box for event details
        doc.setFillColor(0, 102, 204, 0.1); // Light blue background
        doc.rect(10, 10, 190, 40, 'F');
        
        // Add a border to the header
        doc.setDrawColor(0, 102, 204);
        doc.setLineWidth(0.5);
        doc.rect(10, 10, 190, 40, 'S');
        
        // Add event title with larger, bold font
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(0, 102, 204); // Blue text for title
        doc.text(`Event: ${eventDetails.name}`, 14, 20);
        
        // Add event details with normal font
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.setTextColor(68, 68, 68); // Dark gray text for details
        
        // Format date nicely
        const eventDate = new Date(eventDetails.date);
        const formattedDate = eventDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
        
        // Add more comprehensive event information
        doc.text(`Date: ${formattedDate}`, 14, 28);
        doc.text(`Time: ${eventDate.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}`, 14, 34);
        doc.text(`Location: ${eventDetails.location}`, 14, 40);
        doc.text(`Event Type: ${eventDetails.event_type}`, 120, 28);
        
        // Reset text color for the rest of the document
        doc.setTextColor(0, 0, 0);
      }

      if ('income' in columns) {
        // Handle finance report with income and expense sections
        const incomeData = exportData.income.map((item: any) =>
          columns.income.map(col => item[col.accessor])
        );
        const startY = eventDetails ? 45 : 20;

        const expenseData = exportData.expense.map((item: any) =>
          columns.expense.map(col => item[col.accessor])
        );

        // Add income table
        autoTable(doc, {
          head: [columns.income.map(col => col.header)],
          body: incomeData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [40, 167, 69] },
          startY: startY,
          didDrawPage: () => {
            doc.setFontSize(16);
            doc.text('Income', 14, 15);
          }
        });

        // Add expense table
        autoTable(doc, {
          head: [columns.expense.map(col => col.header)],
          body: expenseData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [220, 53, 69] },
          startY: (doc as any).lastAutoTable.finalY + 20,
          didDrawPage: () => {
            doc.setFontSize(16);
            doc.text('Expenses', 14, (doc as any).lastAutoTable.finalY + 15);
          }
        });

        // Add summary if available
        if (exportData.summary) {
          // Cast doc to any to access lastAutoTable property
          const summaryY = (doc as any).lastAutoTable.finalY + 20;
          doc.setFontSize(12);
          doc.text(`Total Income: ${formatAmount(exportData.summary.total_income)}`, 14, summaryY);
          doc.text(`Total Expenses: ${formatAmount(exportData.summary.total_expense)}`, 14, summaryY + 7);
          doc.text(`Balance: ${formatAmount(exportData.summary.balance)}`, 14, summaryY + 14);
        }
      } else {
        // Handle single table export
        const tableData = exportData.map((item: any) =>
          columns.map(col => item[col.accessor])
        );

        // Check if this is a material entry export
        const isMaterialEntry = fileName.toLowerCase().includes('material');

        // Calculate total amount (skip for material entries)
        if (!isMaterialEntry) {
          const total = exportData.reduce((sum: number, item: any) => {
            const amountCol = columns.find(col => col.accessor === 'amount');
            if (amountCol) {
              const amount = typeof item[amountCol.accessor] === 'string' 
                ? parseFloat(item[amountCol.accessor].replace(/[^0-9.-]+/g, '')) 
                : item[amountCol.accessor];
              return sum + (isNaN(amount) ? 0 : amount);
            }
            return sum;
          }, 0);
        }

        autoTable(doc, {
          head: [columns.map(col => col.header)],
          body: tableData,
          theme: 'grid',
          styles: { fontSize: 8 },
          headStyles: { fillColor: [0, 123, 255] },
          startY: eventDetails ? 45 : 20
        });

        // Add total amount after the table (skip for material entries)
        if (!isMaterialEntry) {
          const total = exportData.reduce((sum: number, item: any) => {
            const amountCol = columns.find(col => col.accessor === 'amount');
            if (amountCol) {
              const amount = typeof item[amountCol.accessor] === 'string' 
                ? parseFloat(item[amountCol.accessor].replace(/[^0-9.-]+/g, '')) 
                : item[amountCol.accessor];
              return sum + (isNaN(amount) ? 0 : amount);
            }
            return sum;
          }, 0);
          
          const finalY = (doc as any).lastAutoTable.finalY + 10;
          doc.setFontSize(10);
          doc.text(`Total Amount: ${formatAmount(total)}`, 14, finalY);
        }
      }

      doc.save(`${fileName}.pdf`);
    } catch (error) {
      console.error('Error exporting to PDF:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (variant === 'pdf') {
      exportToPDF();
    } else {
      exportToExcel();
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className={`inline-flex items-center px-4 py-2 rounded-lg text-sm font-semibold shadow-sm transition-all duration-200 ease-in-out
        ${loading ? 'bg-gray-300 cursor-not-allowed' : 
          variant === 'pdf' ? 'bg-red-500 hover:bg-red-600 text-white hover:shadow-md' : 
          'bg-emerald-500 hover:bg-emerald-600 text-white hover:shadow-md'}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Exporting...
        </>
      ) : (
        <>
          <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export to {variant.toUpperCase()}
        </>
      )}
    </button>
  );
}
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface FinanceChartProps {
  income: number;
  expense: number;
  eventName: string;
}

export default function FinanceChart({ income, expense, eventName }: FinanceChartProps) {
  const data = {
    labels: ['Income', 'Expense'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: [income, expense],
        backgroundColor: [
          'rgba(40, 167, 69, 0.7)', // Green for income
          'rgba(220, 53, 69, 0.7)'   // Red for expense
        ],
        borderColor: [
          'rgba(40, 167, 69, 1)',
          'rgba(220, 53, 69, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: `${eventName} - Financial Summary`,
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `₹${context.parsed.y.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '₹' + value;
          }
        }
      }
    }
  };

  return (
    <div className="h-64 w-full">
      <Bar data={data} options={options} />
    </div>
  );
}
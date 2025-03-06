'use client';

import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  Tooltip,
  Legend
);

interface MoiEntry {
  id: number;
  contributor_name: string;
  amount: number;
}

interface MoiDistributionChartProps {
  entries: MoiEntry[];
  eventName: string;
}

export default function MoiDistributionChart({ entries, eventName }: MoiDistributionChartProps) {
  // Group entries by contributor and sum amounts
  const entriesByContributor = entries.reduce((acc: Record<string, number>, entry) => {
    const contributor = entry.contributor_name;
    if (!acc[contributor]) {
      acc[contributor] = 0;
    }
    const amount = typeof entry.amount === 'string' ? parseFloat(entry.amount) : entry.amount;
    acc[contributor] += amount;
    return acc;
  }, {});

  // Get top 5 contributors by amount, group others
  const sortedContributors = Object.entries(entriesByContributor)
    .sort((a, b) => b[1] - a[1]);
  
  let chartData: [string, number][];
  let hasOthers = false;
  
  if (sortedContributors.length > 5) {
    const topContributors = sortedContributors.slice(0, 5);
    const othersAmount = sortedContributors.slice(5).reduce((sum, [_, amount]) => sum + amount, 0);
    chartData = [...topContributors, ['Others', othersAmount]];
    hasOthers = true;
  } else {
    chartData = sortedContributors;
  }

  // Generate colors for each contributor
  const generateColors = (count: number) => {
    const baseColors = [
      'rgba(54, 162, 235, 0.7)', // Blue
      'rgba(255, 99, 132, 0.7)',  // Pink
      'rgba(255, 206, 86, 0.7)', // Yellow
      'rgba(75, 192, 192, 0.7)',  // Teal
      'rgba(153, 102, 255, 0.7)', // Purple
      'rgba(255, 159, 64, 0.7)',  // Orange
    ];
    
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  const contributors = chartData.map(([name]) => name);
  const amounts = chartData.map(([_, amount]) => amount);
  const backgroundColors = generateColors(chartData.length);
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

  const data = {
    labels: contributors,
    datasets: [
      {
        label: 'Amount (₹)',
        data: amounts,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right' as const,
        labels: {
          font: {
            size: 10
          }
        }
      },
      title: {
        display: true,
        text: `${eventName} - Moi Contributions`,
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = Math.round((value * 100) / total);
            return `${label}: ₹${value.toFixed(2)} (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-64 w-full">
      {contributors.length > 0 ? (
        <Pie data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No moi data available
        </div>
      )}
    </div>
  );
}
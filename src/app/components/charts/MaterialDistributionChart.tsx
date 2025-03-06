'use client';

import { Doughnut } from 'react-chartjs-2';
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

interface MaterialEntry {
  id: number;
  material_type: string;
  weight: number;
}

interface MaterialDistributionChartProps {
  materials: MaterialEntry[];
  eventName: string;
}

export default function MaterialDistributionChart({ materials, eventName }: MaterialDistributionChartProps) {
  // Group materials by type and sum weights
  const materialsByType = materials.reduce((acc: Record<string, number>, material) => {
    const type = material.material_type;
    if (!acc[type]) {
      acc[type] = 0;
    }
    acc[type] += material.weight;
    return acc;
  }, {});

  // Generate colors for each material type
  const generateColors = (count: number) => {
    const baseColors = [
      'rgba(54, 162, 235, 0.7)', // Blue
      'rgba(255, 206, 86, 0.7)', // Yellow
      'rgba(75, 192, 192, 0.7)',  // Teal
      'rgba(153, 102, 255, 0.7)', // Purple
      'rgba(255, 159, 64, 0.7)',  // Orange
      'rgba(255, 99, 132, 0.7)',  // Pink
    ];
    
    return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
  };

  const materialTypes = Object.keys(materialsByType);
  const materialWeights = materialTypes.map(type => materialsByType[type]);
  const backgroundColors = generateColors(materialTypes.length);
  const borderColors = backgroundColors.map(color => color.replace('0.7', '1'));

  const data = {
    labels: materialTypes,
    datasets: [
      {
        label: 'Weight (g)',
        data: materialWeights,
        backgroundColor: backgroundColors,
        borderColor: borderColors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<'doughnut'> = {
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
        text: `${eventName} - Material Distribution`,
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
            return `${label}: ${value.toFixed(3)}g (${percentage}%)`;
          }
        }
      }
    },
  };

  return (
    <div className="h-64 w-full">
      {materialTypes.length > 0 ? (
        <Doughnut data={data} options={options} />
      ) : (
        <div className="flex items-center justify-center h-full text-gray-500">
          No material data available
        </div>
      )}
    </div>
  );
}
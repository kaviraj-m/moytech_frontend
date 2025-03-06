'use client';

import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

interface EventDataVisualizerProps {
  eventId: number;
}

interface MoiEntry {
  id: number;
  contributor_name: string;
  amount: number;
  notes: string;
  place: string;
  created_at: string;
}

interface MaterialEntry {
  id: number;
  contributor_name: string;
  material_type: string;
  weight: number;
  description: string;
  place: string;
  created_at: string;
}

interface FinanceSummary {
  total_income: number;
  total_expense: number;
  balance: number;
  income_entries: {
    id: number;
    amount: number;
    description: string;
    category: string;
    date: string;
  }[];
  expense_entries: {
    id: number;
    amount: number;
    description: string;
    category: string;
    date: string;
  }[];
}

export default function EventDataVisualizer({ eventId }: EventDataVisualizerProps) {
  const [moiEntries, setMoiEntries] = useState<MoiEntry[]>([]);
  const [materialEntries, setMaterialEntries] = useState<MaterialEntry[]>([]);
  const [financeSummary, setFinanceSummary] = useState<FinanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError('');

        const [moiResponse, materialResponse, financeResponse] = await Promise.all([
          fetch(`http://localhost:3000/api/moyentries/event/${eventId}`),
          fetch(`http://localhost:3000/api/materialentries/event/${eventId}`),
          fetch(`http://localhost:3000/api/finance/detailed-summary/${eventId}`)
        ]);

        if (!moiResponse.ok || !materialResponse.ok || !financeResponse.ok) {
          throw new Error('Failed to fetch event data');
        }

        const moiData = await moiResponse.json();
        const materialData = await materialResponse.json();
        const financeData = await financeResponse.json();

        setMoiEntries(moiData);
        setMaterialEntries(materialData);
        setFinanceSummary(financeData);
      } catch (err) {
        setError('Error fetching data for visualization');
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#007BFF]"></div>
        <span className="ml-2 text-black">Loading charts...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border-l-4 border-red-500 text-black">
        <p>{error}</p>
      </div>
    );
  }

  // Prepare data for financial summary chart
  const financialChartData = {
    labels: ['Income', 'Expense', 'Balance'],
    datasets: [
      {
        label: 'Amount (₹)',
        data: financeSummary ? [
          financeSummary.total_income,
          financeSummary.total_expense,
          financeSummary.balance
        ] : [0, 0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for material types pie chart
  const materialTypes = materialEntries.reduce((acc: Record<string, number>, entry) => {
    const type = entry.material_type;
    acc[type] = (acc[type] || 0) + entry.weight;
    return acc;
  }, {});

  const materialChartData = {
    labels: Object.keys(materialTypes),
    datasets: [
      {
        label: 'Weight',
        data: Object.values(materialTypes),
        backgroundColor: [
          'rgba(255, 99, 132, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  // Prepare data for moi entries by place
  const moiByPlace = moiEntries.reduce((acc: Record<string, number>, entry) => {
    const place = entry.place || 'Unknown';
    acc[place] = (acc[place] || 0) + Number(entry.amount);
    return acc;
  }, {});

  const moiChartData = {
    labels: Object.keys(moiByPlace),
    datasets: [
      {
        label: 'Contributions by Location',
        data: Object.values(moiByPlace),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Options for the charts
  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'black'
        }
      },
      title: {
        display: true,
        text: 'Financial Summary',
        color: 'black'
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: 'black'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  const pieOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: 'black'
        }
      },
      title: {
        display: true,
        text: 'Material Types Distribution',
        color: 'black'
      },
    },
  };

  return (
    <div className="space-y-10">
      <div className="bg-white rounded-lg shadow-md p-8">
        <h3 className="text-lg font-semibold mb-6 text-black">Financial Overview</h3>
        <div className="h-64">
          <Bar data={financialChartData} options={barOptions} />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold mb-6 text-black">Material Donations</h3>
          <div className="h-64">
            {Object.keys(materialTypes).length > 0 ? (
              <Pie data={materialChartData} options={pieOptions} />
            ) : (
              <p className="text-center text-black">No material entries available</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold mb-6 text-black">Contributions by Location</h3>
          <div className="h-64">
            {Object.keys(moiByPlace).length > 0 ? (
              <Bar data={moiChartData} options={{
                ...barOptions,
                plugins: {
                  ...barOptions.plugins,
                  title: {
                    ...barOptions.plugins.title,
                    text: 'Contributions by Location'
                  }
                }
              }} />
            ) : (
              <p className="text-center text-black">No contribution entries available</p>
            )}
          </div>
        </div>
      </div>

      {financeSummary && financeSummary.income_entries.length > 0 && (
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-lg font-semibold mb-6 text-black">Income Categories</h3>
          <div className="h-64">
            <Pie 
              data={{
                labels: Array.from(new Set(financeSummary.income_entries.map(entry => entry.category))),
                datasets: [{
                  label: 'Amount',
                  data: Array.from(new Set(financeSummary.income_entries.map(entry => entry.category))).map(
                    category => financeSummary.income_entries
                      .filter(entry => entry.category === category)
                      .reduce((sum, entry) => sum + Number(entry.amount), 0)
                  ),
                  backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)'
                  ],
                  borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                  ],
                  borderWidth: 1,
                }]
              }}
              options={{
                ...pieOptions,
                plugins: {
                  ...pieOptions.plugins,
                  title: {
                    ...pieOptions.plugins.title,
                    text: 'Income by Category'
                  }
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
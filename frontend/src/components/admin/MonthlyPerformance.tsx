'use client';

import { useEffect, useState } from 'react';
import { fetchMonthlyPerformance, type PeriodStats } from '@/services/api';

export function MonthlyPerformance() {
  const [monthlyData, setMonthlyData] = useState<PeriodStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchMonthlyPerformance();
        setMonthlyData(data);
      } catch (error) {
        console.error('Failed to fetch monthly performance:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-4">Monthly Performance</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="h-6 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2" />
                <div className="h-4 bg-gray-200 rounded w-2/3" />
                <div className="h-4 bg-gray-200 rounded w-1/3" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white-500 mb-4">Monthly Performance</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {monthlyData.map((month) => (
          <div key={`${month.startDate}-${month.endDate}`} className="bg-white rounded-lg p-4">
            <h3 className="text-gray-900 font-bold mb-2">
              {new Date(month.startDate).toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
            </h3>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600">Orders: {month.orderCount}</p>
              <p className="text-gray-600">Avg. Order: ${month.averageOrderValue.toFixed(2)}</p>
              <p className="text-red-500 font-bold">Revenue: ${month.revenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 
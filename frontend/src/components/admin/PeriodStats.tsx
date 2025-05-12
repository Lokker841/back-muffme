'use client';

import { useState } from 'react';
import { fetchPeriodStats, type PeriodStats as PeriodStatsType } from '@/services/api';
import { useEffect } from 'react';

type Period = '24h' | '7d' | '30d';

export function PeriodStats() {
  const [period, setPeriod] = useState<Period>('30d');
  const [stats, setStats] = useState<PeriodStatsType>({
    revenue: 0,
    orderCount: 0,
    averageOrderValue: 0,
    startDate: '',
    endDate: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      setLoading(true);
      try {
        const data = await fetchPeriodStats(period);
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch period stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [period]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-white-500">Period Statistics</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setPeriod('24h')}
            className={`px-3 py-1 rounded text-sm ${
              period === '24h' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Last 24 Hours
          </button>
          <button
            onClick={() => setPeriod('7d')}
            className={`px-3 py-1 rounded text-sm ${
              period === '7d' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setPeriod('30d')}
            className={`px-3 py-1 rounded text-sm ${
              period === '30d' ? 'bg-red-500' : 'bg-white/10 hover:bg-white/20'
            }`}
          >
            Last 30 Days
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-6">
          <h3 className="text-red-500 font-bold mb-2">Orders</h3>
          {loading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded w-20" />
          ) : (
            <>
              <p className="text-4xl font-bold text-gray-900">{stats.orderCount}</p>
              <p className="text-sm text-gray-600 mt-1">Total orders in last {period}</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-red-500 font-bold mb-2">Revenue</h3>
          {loading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded w-32" />
          ) : (
            <>
              <p className="text-4xl font-bold text-gray-900">${stats.revenue.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Total revenue in last {period}</p>
            </>
          )}
        </div>

        <div className="bg-white rounded-lg p-6">
          <h3 className="text-red-500 font-bold mb-2">Average Order Value</h3>
          {loading ? (
            <div className="animate-pulse h-10 bg-gray-200 rounded w-32" />
          ) : (
            <>
              <p className="text-4xl font-bold text-gray-900">${stats.averageOrderValue.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">Average order value in last {period}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
} 
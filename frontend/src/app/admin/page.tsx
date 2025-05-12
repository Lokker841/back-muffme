'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { StatsCard } from '@/components/admin/StatsCard'
import { PeriodStats } from '@/components/admin/PeriodStats'
import { MonthlyPerformance } from '@/components/admin/MonthlyPerformance'
import { PopularProducts } from '@/components/admin/PopularProducts'
import { RecentOrders } from '@/components/admin/RecentOrders'
import { RecentUsers } from '@/components/admin/RecentUsers'
import { fetchAdminStats, type AdminStats } from '@/services/api'
import { isAuthenticated } from '@/services/adminAuth';

export default function AdminPage() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    totalOrders: 0,
    totalRevenue: 0,
    activeUsers: 0,
    recentOrders: 0,
    averageOrderValue: 0,
    periodStats: [],
    popularProducts: [],
    last24HoursRevenue: 0,
    lastWeekRevenue: 0,
    lastMonthRevenue: 0,
    last24HoursOrders: 0,
    lastWeekOrders: 0,
    lastMonthOrders: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/login');
      return;
    }

    async function loadStats() {
      try {
        const data = await fetchAdminStats();
        setStats(data);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="bg-indigo-400/30 rounded-lg p-6 animate-pulse">
              <div className="h-4 bg-white/20 rounded w-1/2 mb-4" />
              <div className="h-8 bg-white/20 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
        <div className="bg-red-500/20 border border-red-500 text-red-300 px-6 py-4 rounded">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <StatsCard 
          title="Total Users" 
          value={stats.totalUsers.toString()} 
          bgColor="bg-blue-500" 
        />
        <StatsCard 
          title="Total Orders" 
          value={stats.totalOrders.toString()} 
          bgColor="bg-green-500" 
        />
        <StatsCard 
          title="Total Revenue" 
          value={`$${stats.totalRevenue.toFixed(2)}`} 
          bgColor="bg-purple-500" 
        />
        <StatsCard 
          title="Average Order Value" 
          value={`$${stats.averageOrderValue.toFixed(2)}`} 
          bgColor="bg-blue-600" 
        />
        <StatsCard 
          title="Active Users (30d)" 
          value={stats.activeUsers.toString()} 
          bgColor="bg-yellow-500" 
        />
      </div>

      {/* Period Statistics */}
      <div className="bg-indigo-400/30 rounded-lg p-6 mb-6">
        <PeriodStats />
      </div>

      {/* Monthly Performance */}
      <div className="bg-indigo-400/30 rounded-lg p-6 mb-6">
        <MonthlyPerformance />
      </div>

      {/* Popular Products */}
      <div className="bg-indigo-400/30 rounded-lg p-6 mb-6">
        <PopularProducts />
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-indigo-400/30 rounded-lg p-6">
          <RecentOrders />
        </div>
        <div className="bg-indigo-400/30 rounded-lg p-6">
          <RecentUsers />
        </div>
      </div>
    </div>
  )
} 
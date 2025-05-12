'use client';

import { useEffect, useState } from 'react';
import { fetchRecentOrders, type Order } from '@/services/api';

type OrderStatus = 'COMPLETED' | 'PENDING' | 'PROCESSING' | 'CANCELLED';

const statusColors: Record<OrderStatus, string> = {
  COMPLETED: 'bg-green-100 text-green-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  PROCESSING: 'bg-blue-100 text-blue-800',
  CANCELLED: 'bg-red-100 text-red-800',
};

export function RecentOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchRecentOrders(15);
        setOrders(data);
      } catch (error) {
        console.error('Failed to fetch recent orders:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-gray-600">ORDER ID</th>
                <th className="px-6 py-3 text-gray-600">CUSTOMER</th>
                <th className="px-6 py-3 text-gray-600">AMOUNT</th>
                <th className="px-6 py-3 text-gray-600">STATUS</th>
                <th className="px-6 py-3 text-gray-600">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-8" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-2">
                      <div className="animate-pulse h-4 bg-gray-200 rounded w-32" />
                      <div className="animate-pulse h-3 bg-gray-200 rounded w-40" />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-20" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-6 bg-gray-200 rounded w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-24" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-white-500 mb-4">Recent Orders</h2>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="max-h-[350px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="text-left">
                <th className="px-6 py-3 text-gray-600">ORDER ID</th>
                <th className="px-6 py-3 text-gray-600">CUSTOMER</th>
                <th className="px-6 py-3 text-gray-600">AMOUNT</th>
                <th className="px-6 py-3 text-gray-600">STATUS</th>
                <th className="px-6 py-3 text-gray-600">DATE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-6 py-4 text-red-500">#{order.id}</td>
                  <td className="px-6 py-4">
                    <div className="text-gray-900">{order.user.name}</div>
                    <div className="text-gray-500 text-sm">{order.user.email}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-900">${order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status.toUpperCase() as OrderStatus]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
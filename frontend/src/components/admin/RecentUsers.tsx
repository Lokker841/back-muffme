'use client';

import { useEffect, useState } from 'react';
import { fetchRecentUsers, type User } from '@/services/api';

export function RecentUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchRecentUsers(15);
        setUsers(data);
      } catch (error) {
        console.error('Failed to fetch recent users:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-4">Recent Users</h2>
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-gray-600">NAME</th>
                <th className="px-6 py-3 text-gray-600">CONTACT</th>
                <th className="px-6 py-3 text-gray-600">JOINED</th>
                <th className="px-6 py-3 text-gray-600">LAST LOGIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-48" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-24" />
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
      <h2 className="text-xl font-bold text-white-500 mb-4">Recent Users</h2>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="max-h-[350px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="text-left">
                <th className="px-6 py-3 text-gray-600">NAME</th>
                <th className="px-6 py-3 text-gray-600">CONTACT</th>
                <th className="px-6 py-3 text-gray-600">JOINED</th>
                <th className="px-6 py-3 text-gray-600">LAST LOGIN</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 text-red-500">{user.name}</td>
                  <td className="px-6 py-4 text-gray-500">
                    <div>{user.email}</div>
                    <div className="text-sm">{user.phoneNumber}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-gray-500">
                    {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleDateString() : 'Never'}
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
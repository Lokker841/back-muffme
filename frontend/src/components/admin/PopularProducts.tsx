'use client';

import { useEffect, useState } from 'react';
import { fetchPopularProducts, type PopularProduct } from '@/services/api';

export function PopularProducts() {
  const [products, setProducts] = useState<PopularProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const data = await fetchPopularProducts(10);
        setProducts(data);
      } catch (error) {
        console.error('Failed to fetch popular products:', error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="text-xl font-bold text-red-500 mb-4">Popular Products</h2>
        <div className="bg-white rounded-lg overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-3 text-gray-600">PRODUCT</th>
                <th className="px-6 py-3 text-gray-600">ORDERS</th>
                <th className="px-6 py-3 text-gray-600">REVENUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <div className="animate-pulse h-4 bg-gray-200 rounded w-16" />
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
      <h2 className="text-xl font-bold text-white-500 mb-4">Popular Products</h2>
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="max-h-[350px] overflow-auto">
          <table className="w-full">
            <thead className="sticky top-0 bg-gray-50 z-10">
              <tr className="text-left">
                <th className="px-6 py-3 text-gray-600">PRODUCT</th>
                <th className="px-6 py-3 text-gray-600">ORDERS</th>
                <th className="px-6 py-3 text-gray-600">REVENUE</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {products.map((product) => (
                <tr key={product.productId}>
                  <td className="px-6 py-4 text-red-500">{product.name}</td>
                  <td className="px-6 py-4 text-gray-900">{product.orderCount}</td>
                  <td className="px-6 py-4 text-gray-900">${product.totalRevenue.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
} 
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { isAuthenticated, logout } from '@/services/adminAuth';
import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  
  // Don't check auth on login page
  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated()) {
      router.push('/admin/login');
    } else {
      setLoading(false);
    }
  }, [router, isLoginPage]);

  const handleLogout = () => {
    logout();
  };

  if (isLoginPage) {
    return children;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      <header className="bg-gray-800 p-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <nav className="flex items-center space-x-4">
            <Link href="/admin" className="hover:text-blue-400 transition-colors">
              Dashboard
            </Link>
            <Link href="/admin/database" className="hover:text-blue-400 transition-colors">
              Database
            </Link>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition-colors"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
    </div>
  );
} 
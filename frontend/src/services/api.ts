const API_URL = 'http://localhost:3001/api';

// Get admin token from localStorage
function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('admin_token');
}

// Add authorization header if admin token exists
function getAuthHeaders(): HeadersInit {
  const token = getAdminToken();
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  return headers;
}

export interface AdminStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  recentOrders: number;
  averageOrderValue: number;
  periodStats: PeriodStats[];
  popularProducts: PopularProduct[];
  last24HoursRevenue: number;
  lastWeekRevenue: number;
  lastMonthRevenue: number;
  last24HoursOrders: number;
  lastWeekOrders: number;
  lastMonthOrders: number;
}

export interface PeriodStats {
  revenue: number;
  orderCount: number;
  averageOrderValue: number;
  startDate: string;
  endDate: string;
}

export interface PopularProduct {
  productId: number;
  name: string;
  orderCount: number;
  totalRevenue: number;
}

export interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  totalBonus: number;
  usedBonus: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    phoneNumber: string;
  };
}

export interface User {
  id: number;
  name: string;
  phoneNumber: string;
  birthday?: string;
  createdAt: string;
  lastLoginAt: string;
}

export async function fetchAdminStats(): Promise<AdminStats> {
  const response = await fetch(`${API_URL}/admin/stats`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    // Redirect to login if unauthorized
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch admin stats');
  return response.json();
}

export async function fetchPeriodStats(period: '24h' | '7d' | '30d'): Promise<PeriodStats> {
  const response = await fetch(`${API_URL}/admin/period-stats?period=${period}`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch period stats');
  return response.json();
}

export async function fetchMonthlyPerformance(): Promise<PeriodStats[]> {
  const response = await fetch(`${API_URL}/admin/monthly-performance`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch monthly performance');
  return response.json();
}

export async function fetchPopularProducts(limit: number = 5): Promise<PopularProduct[]> {
  const response = await fetch(`${API_URL}/admin/popular-products?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch popular products');
  return response.json();
}

export async function fetchRecentOrders(limit: number = 5): Promise<Order[]> {
  const response = await fetch(`${API_URL}/admin/recent-orders?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch recent orders');
  return response.json();
}

export async function fetchRecentUsers(limit: number = 5): Promise<User[]> {
  const response = await fetch(`${API_URL}/admin/recent-users?limit=${limit}`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch recent users');
  return response.json();
}

export async function fetchTables(): Promise<string[]> {
  const response = await fetch(`${API_URL}/admin/database/tables`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch tables');
  return response.json();
}

export async function fetchTableData(table: string): Promise<{ columns: string[]; rows: Record<string, any>[] }> {
  const response = await fetch(`${API_URL}/admin/database/${table}`, {
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to fetch table data');
  return response.json();
}

export async function createRecord(table: string, data: Record<string, any>): Promise<void> {
  const response = await fetch(`${API_URL}/admin/database/${table}`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to create record');
}

export async function updateRecord(table: string, id: number, data: Record<string, string>): Promise<void> {
  const response = await fetch(`${API_URL}/admin/database/${table}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to update record');
}

export async function deleteRecord(table: string, id: number): Promise<void> {
  const response = await fetch(`${API_URL}/admin/database/${table}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });
  
  if (response.status === 401) {
    window.location.href = '/admin/login';
    throw new Error('Unauthorized');
  }
  
  if (!response.ok) throw new Error('Failed to delete record');
}
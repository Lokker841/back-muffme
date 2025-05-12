const API_URL = 'http://localhost:3001/api';

export interface AdminLoginResponse {
  access_token: string;
}

export async function login(username: string, password: string): Promise<AdminLoginResponse> {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password }),
  });

  if (!response.ok) {
    throw new Error('Invalid credentials');
  }

  return response.json();
}

export function getAdminToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  return localStorage.getItem('admin_token');
}

export function setAdminToken(token: string): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.setItem('admin_token', token);
}

export function removeAdminToken(): void {
  if (typeof window === 'undefined') {
    return;
  }
  localStorage.removeItem('admin_token');
}

export function isAuthenticated(): boolean {
  return !!getAdminToken();
}

export async function logout(): Promise<void> {
  removeAdminToken();
  window.location.href = '/admin/login';
} 
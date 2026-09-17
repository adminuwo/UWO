const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export function getToken() {
  return localStorage.getItem('ref_auth_token');
}

export function setToken(token) {
  if (token) {
    localStorage.setItem('ref_auth_token', token);
  } else {
    localStorage.removeItem('ref_auth_token');
  }
}

export function removeToken() {
  localStorage.removeItem('ref_auth_token');
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  let data;
  try {
    data = await res.json();
  } catch (e) {
    data = {};
  }

  if (!res.ok) {
    throw new Error(data.error || data.message || `Server responded with status ${res.status} (${res.statusText || 'Error'})`);
  }

  return data;
}

export const api = {
  // Auth
  register: (data) => request('/api/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data) => request('/api/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/api/auth/me', { method: 'GET' }),
  logout: () => {
    removeToken();
  },

  // Projects / Products
  getProducts: () => request('/api/products', { method: 'GET' }),
  addProduct: (data) => request('/api/products', { method: 'POST', body: JSON.stringify(data) }),
  updateProduct: (id, data) => request(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // Links
  getLinks: () => request('/api/links', { method: 'GET' }),
  generateLink: (data) => request('/api/links', { method: 'POST', body: JSON.stringify(data) }),
  getActivity: () => request('/api/links/activity', { method: 'GET' }),

  // App Conversions / Download Tracking & Simulation
  simulateClick: (data) => request('/api/conversions/simulate-click', { method: 'POST', body: JSON.stringify(data) }),
  verifyIosInstall: (data = {}) => request('/api/conversions/ios-verify', { method: 'POST', body: JSON.stringify(data) }),
  recordAndroidInstall: (data) => request('/api/conversions/android-install', { method: 'POST', body: JSON.stringify(data) }),
  getPendingIos: () => request('/api/conversions/pending-ios', { method: 'GET' }),

  // Links
  deleteLink: (id) => request(`/api/links/${id}`, { method: 'DELETE' }),
};

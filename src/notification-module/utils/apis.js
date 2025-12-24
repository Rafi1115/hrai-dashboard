import axios from 'axios';

const BASE_URL = 'https://api.hrlynx.ai';

// Get auth token from cookie
export const getAuthToken = () => {
  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("adminToken="));
  return token ? token.split("=")[1] : null;
};

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// API functions
export const notificationApi = {
  // Fetch notifications from the unified endpoint
  fetchNotifications: async (page = 1, search = '', status = '', notification_type = '', date_from = '') => {
    const params = new URLSearchParams();
    if (page) params.append('page', page);
    if (search) params.append('search', search);
    if (status) params.append('status', status);
    if (notification_type) params.append('notification_type', notification_type);
    if (date_from) params.append('date_from', date_from);
    
    const response = await apiClient.get(`/api/notifications/admin-notifications/unified/?${params.toString()}`);
    return response.data;
  },

  // Send immediate notification
  sendImmediate: async (payload) => {
    const response = await apiClient.post('/api/notifications/admin/send-immediate/', payload);
    return response.data;
  },

  // Schedule notification
  schedule: async (payload) => {
    const response = await apiClient.post('/api/notifications/admin/schedule/', payload);
    return response.data;
  },

  // Cancel scheduled notification
  cancelScheduled: async (id) => {
    const response = await apiClient.post(`/api/notifications/admin/scheduled/${id}/cancel/`);
    return response.data;
  },

  // Delete single notification - NEW API
  delete: async (id) => {
    const response = await apiClient.delete(`/api/notifications/delete/${id}/`);
    return response.data;
  },

  // Bulk delete notifications - NEW API
  bulkDelete: async (notificationIds) => {
    const response = await apiClient.delete('/api/notifications/bulk-delete/', {
      data: { notification_ids: notificationIds }
    });
    return response.data;
  }
};
export const userApi = {
  // Fetch all users
  fetchUsers: async () => {
    const response = await apiClient.get('/api/dashboard/users/');
    return response.data.results || response.data || [];
  }
};
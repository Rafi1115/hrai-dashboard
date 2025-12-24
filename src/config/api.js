// Real API configuration - Update base_url with your actual domain
export const API_BASE_URL = "https://api.hrlynx.ai";

// Helper function to get auth token (from cookies or localStorage)
export const getAuthToken = () => {
  // First try to get from cookies
  const cookieToken = document.cookie
    .split('; ')
    .find(row => row.startsWith('adminToken='))
    ?.split('=')[1];
  
  // If not in cookies, try localStorage
  if (cookieToken) return cookieToken;
  
  const localToken = localStorage.getItem('token');
  return localToken;
};

// Helper function to get auth headers
export const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

// Helper function to get auth headers for FormData
export const getAuthHeadersForFormData = () => {
  const token = getAuthToken();
  return {
    'Authorization': `Bearer ${token}`,
    // Don't set Content-Type for FormData - let the browser set it
  };
};
// tokenManager.js
// Centralized token management for authentication

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The access token or null if not found
 */
export const getAccessToken = () => {
  if (typeof window === 'undefined') return null;
  // Check multiple possible token key names
  return localStorage.getItem('adminAuthToken') || 
         localStorage.getItem('authToken') || 
         localStorage.getItem('access_token') || 
         localStorage.getItem('accessToken');
};

/**
 * Get the refresh token from localStorage
 * @returns {string|null} The refresh token or null if not found
 */
export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('adminTokenRefresh') || 
         localStorage.getItem('refresh_token') || 
         localStorage.getItem('refreshToken');
};

/**
 * Set the authentication tokens in localStorage
 * @param {string} accessToken - The access token
 * @param {string} refreshToken - The refresh token (optional)
 */
export const setTokens = (accessToken, refreshToken = null) => {
  if (typeof window === 'undefined') return;
  
  // Store with your app's naming convention
  localStorage.setItem('adminAuthToken', accessToken);
  if (refreshToken) {
    localStorage.setItem('adminTokenRefresh', refreshToken);
  }
};

/**
 * Clear all authentication tokens from localStorage
 */
export const clearTokens = () => {
  if (typeof window === 'undefined') return;
  
  // Clear all possible token keys
  localStorage.removeItem('adminAuthToken');
  localStorage.removeItem('adminTokenRefresh');
  localStorage.removeItem('authToken');
  localStorage.removeItem('access_token');
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('refreshToken');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if access token exists
 */
export const isAuthenticated = () => {
  return !!getAccessToken();
};

/**
 * Get authorization headers for API requests
 * @returns {Object} Headers object with Authorization bearer token
 */
export const getAuthHeaders = () => {
  const token = getAccessToken();
  if (!token) {
    return {};
  }
  
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * Create axios config with authentication headers
 * @param {Object} additionalConfig - Additional axios config options
 * @returns {Object} Complete axios config with auth headers
 */
export const getAuthConfig = (additionalConfig = {}) => {
  return {
    ...additionalConfig,
    headers: {
      ...getAuthHeaders(),
      ...(additionalConfig.headers || {}),
    },
  };
};
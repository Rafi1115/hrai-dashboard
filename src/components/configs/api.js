export const API_BASE_URL = "https://api.hrlynx.ai";

export const getApiUrl = (endpoint) => {
  return `${API_BASE_URL}${endpoint}`;
};
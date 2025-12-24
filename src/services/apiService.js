import { API_BASE_URL, getAuthHeaders, getAuthHeadersForFormData } from '../config/api.js';

// API Functions
export const api = {
  // Get categories
  getCategories: async () => {
    const response = await fetch(`${API_BASE_URL}/news/categories/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch categories');
    return response.json();
  },

  // Get all products
  getProducts: async () => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/`, {
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  // Create product
  createProduct: async (formData) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/`, {
      method: 'POST',
      headers: getAuthHeadersForFormData(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  // Update product
  updateProduct: async (id, formData) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'PUT',
      headers: getAuthHeadersForFormData(),
      body: formData,
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  // Delete product
  deleteProduct: async (id) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.ok;
  },

  // Toggle product status
  toggleProductStatus: async (id, isActive) => {
    const response = await fetch(`${API_BASE_URL}/affiliate/admin/products/${id}/`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ is_active: isActive }),
    });
    if (!response.ok) throw new Error('Failed to update product status');
    return response.json();
  },
};
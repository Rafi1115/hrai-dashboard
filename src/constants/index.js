// Default form values
export const DEFAULT_DISCLAIMER = "As an Amazon Associate, we may earn from qualifying purchases";

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED_FIELDS: "Please fill in all required fields",
  PRODUCT_CREATED: "Product created successfully!",
  PRODUCT_UPDATED: "Product updated successfully!",
  PRODUCT_DELETED: "Product deleted successfully!",
  STATUS_UPDATED: "Product status updated!",
  DELETE_CONFIRMATION: "Are you sure you want to delete this product?",
};

// Error messages
export const ERROR_MESSAGES = {
  FETCH_CATEGORIES: "Failed to load categories",
  FETCH_PRODUCTS: "Failed to load products",
  SAVE_PRODUCT: "Error saving product",
  DELETE_PRODUCT: "Error deleting product",
  UPDATE_STATUS: "Error updating product status",
  AUTH_ERROR: "You need to be logged in to access this page. Please log in and try again.",
};

// API endpoints (relative to base URL)
export const API_ENDPOINTS = {
  CATEGORIES: "/news/categories/",
  PRODUCTS: "/affiliate/admin/products/",
  PRODUCT_DETAIL: (id) => `/affiliate/admin/products/${id}/`,
};

// Form field names
export const FORM_FIELDS = {
  CATEGORY: "category",
  TITLE: "title",
  AFFILIATE_URL: "affiliate_url",
  DISCLAIMER: "disclaimer",
  IMAGE: "image",
};

// Table column headers
export const TABLE_HEADERS = {
  IMAGE: "Image",
  TITLE: "Product Title",
  CATEGORY: "Category",
  CLICKS: "Clicks",
  STATUS: "Status",
  ACTIONS: "Actions",
};
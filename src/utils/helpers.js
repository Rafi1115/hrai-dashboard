// Helper function to get category name by ID
export const getCategoryName = (categoryId, categories) => {
  const category = categories.find(cat => cat.id === categoryId);
  return category ? category.name : 'Unknown Category';
};

// Helper function to check if error is authentication related
export const isAuthError = (error) => {
  return error.message.includes('Failed to fetch') || error.message.includes('401');
};

// Helper function to create form data for product submission
export const createProductFormData = (formState, selectedFile) => {
  const formData = new FormData();
  formData.append('category', formState.category);
  formData.append('title', formState.title);
  formData.append('affiliate_url', formState.affiliate_url);
  formData.append('disclaimer', formState.disclaimer);
  formData.append('is_active', 'true');
  
  if (selectedFile) {
    formData.append('image', selectedFile);
  }
  
  return formData;
};

// Helper function to reset form state
export const getInitialFormState = () => ({
  category: "",
  title: "",
  affiliate_url: "",
  disclaimer: "As an Amazon Associate, we may earn from qualifying purchases",
});

// Helper function to validate form
export const validateForm = (formState) => {
  return formState.category && formState.title && formState.affiliate_url;
};
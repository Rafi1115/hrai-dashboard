import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { api } from '../services/apiService.js';
import { 
  isAuthError, 
  createProductFormData, 
  getInitialFormState, 
  validateForm 
} from '../utils/helpers.js';

export const useAffiliateProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authError, setAuthError] = useState(false);
  const [formState, setFormState] = useState(getInitialFormState());
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Fetch categories and products on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data.data || []);
      console.log("Categories loaded:", data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
      if (isAuthError(error)) {
        setAuthError(true);
      }
      setError("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await api.getProducts();
      setProducts(data.results || []);
      console.log("Products loaded:", data.results);
    } catch (error) {
      console.error("Error fetching products:", error);
      if (isAuthError(error)) {
        setAuthError(true);
      }
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const fileUrl = URL.createObjectURL(file);
      setImagePreview(fileUrl);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm(formState)) {
      toast.error("Please fill in all required fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = createProductFormData(formState, selectedFile);

      if (editingProduct) {
        await api.updateProduct(editingProduct.id, formData);
        toast.success("Product updated successfully!");
      } else {
        await api.createProduct(formData);
        toast.success("Product created successfully!");
      }

      await fetchProducts();
      resetForm();
    } catch (error) {
      console.error("Error saving product:", error);
      if (isAuthError(error)) {
        setAuthError(true);
      }
      toast.error(`Error saving product: ${error.message}`);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormState({
      category: product.category.toString(),
      title: product.title,
      affiliate_url: product.affiliate_url,
      disclaimer: product.disclaimer,
    });
    setImagePreview(product.image);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    toast((t) => (
      <span>
        Are you sure you want to delete this product?
        <div style={{ marginTop: 8, display: 'flex', gap: 8 }}>
          <button
            style={{ background: '#ef4444', color: 'white', padding: '4px 12px', borderRadius: 4 }}
            onClick={async () => {
              toast.dismiss(t.id);
              setLoading(true);
              try {
                await api.deleteProduct(id);
                toast.success("Product deleted successfully!");
                await fetchProducts();
              } catch (error) {
                toast.error(`Error deleting product: ${error.message}`);
              } finally {
                setLoading(false);
              }
            }}
          >Yes</button>
          <button
            style={{ background: '#e5e7eb', color: '#111827', padding: '4px 12px', borderRadius: 4 }}
            onClick={() => toast.dismiss(t.id)}
          >No</button>
        </div>
      </span>
    ), { duration: 8000 });
  };

  const handleToggleActive = async (id) => {
    try {
      const product = products.find(p => p.id === id);
      const newStatus = !product.is_active;
      
      await api.toggleProductStatus(id, newStatus);
      toast.success("Product status updated!");
      
      await fetchProducts();
    } catch (error) {
      console.error("Error updating product status:", error);
      if (isAuthError(error)) {
        setAuthError(true);
      }
      toast.error(`Error updating product status: ${error.message}`);
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const resetForm = () => {
    setEditingProduct(null);
    setFormState(getInitialFormState());
    setSelectedFile(null);
    setImagePreview(null);
  };

  return {
    // State
    products,
    categories,
    editingProduct,
    loading,
    error,
    authError,
    formState,
    selectedFile,
    imagePreview,
    
    // Actions
    handleInputChange,
    handleFileChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    handleCancel,
    setError,
    
    // Utils
    fetchCategories,
    fetchProducts
  };
};
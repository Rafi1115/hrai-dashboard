"use client";

import React from "react";
import { useAffiliateProducts } from '../hooks/useAffiliateProducts.js';
import ProductForm from './ProductForm.jsx';
import ProductsTable from './ProductsTable.jsx';
import AuthError from './AuthError.jsx';

export default function AffiliateProductManagement() {
  const {
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
    setError
  } = useAffiliateProducts();

  // If authentication error, show auth error component
  if (authError) {
    return <AuthError />;
  }

  return (
    <div className="min-h-screen p-4 sm:p-8 bg-white text-black">
      <h2 className="text-2xl font-semibold mb-6 text-[#000000]">Affiliate Product Management</h2>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="text-red-800">{error}</div>
          <button 
            onClick={() => setError(null)} 
            className="text-red-600 hover:text-red-800 text-sm mt-2"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Product Form Component */}
      <ProductForm
        formState={formState}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
        categories={categories}
        editingProduct={editingProduct}
        loading={loading}
        imagePreview={imagePreview}
        error={error}
      />

      {/* Products Table Component */}
      <ProductsTable
        products={products}
        categories={categories}
        loading={loading}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleToggleActive={handleToggleActive}
      />
    </div>
  );
}
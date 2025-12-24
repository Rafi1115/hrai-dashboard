import React from 'react';

const ProductForm = ({
  formState,
  handleInputChange,
  handleFileChange,
  handleSubmit,
  handleCancel,
  categories,
  editingProduct,
  loading,
  imagePreview,
  error
}) => {
  return (
    <div className="rounded p-6 mb-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4 text-[#013D3B]">
        {editingProduct ? "Edit Product" : "Add New Product"}
      </h3>
      
      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Category Dropdown */}
          <div className="flex flex-col">
            <label htmlFor="category" className="text-sm font-bold text-black mb-2 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
              Category <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                id="category"
                name="category"
                value={formState.category}
                onChange={handleInputChange}
                required
                className="w-full p-3 pr-10 border border-gray-300 rounded text-black font-normal bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
              >
                <option value="" className="text-gray-400">Select a category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id} className="text-[#013D3B] font-bold">
                    {category.name}
                  </option>
                ))}
              </select>
              {/* <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#013D3B" strokeWidth="2" d="M6 9l6 6 6-6"/></svg>
              </span> */}
            </div>
          </div>

          {/* Product Title */}
          <div className="flex flex-col">
            <label htmlFor="title" className="text-sm font-bold text-black mb-2 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h8"/></svg>
              Product Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              placeholder="Enter product title"
              value={formState.title}
              onChange={handleInputChange}
              required
              className="p-3 border border-gray-300 rounded text-black font-normal bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          {/* Affiliate URL */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="affiliate_url" className="text-sm font-bold text-black mb-2 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M4 6h16M4 12h8"/></svg>
              Affiliate URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              id="affiliate_url"
              name="affiliate_url"
              placeholder="https://www.amazon.com/..."
              value={formState.affiliate_url}
              onChange={handleInputChange}
              required
              className="p-3 border border-gray-300 rounded text-black font-normal bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
            />
          </div>
          {/* Image Upload */}
          <div className="flex-1 flex flex-col">
            <label htmlFor="image" className="text-sm font-bold text-black mb-2 flex items-center gap-2">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M8 12l2 2 4-4"/></svg>
              Product Image
            </label>
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleFileChange}
              className="p-3 border border-gray-300 rounded text-black font-normal bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-normal file:bg-gray-800 file:text-white hover:file:bg-gray-700"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Product preview"
                className="w-32 h-20 object-cover rounded-xl mt-2 border-2 border-[#013D3B] shadow-lg"
              />
            )}
          </div>
        </div>

        {/* Disclaimer */}
        <div className="flex flex-col">
          <label htmlFor="disclaimer" className="text-sm font-bold text-black mb-2 flex items-center gap-2">
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="currentColor" strokeWidth="2"/><path stroke="currentColor" strokeWidth="2" d="M8 12h8"/></svg>
            Disclaimer
          </label>
          <textarea
            id="disclaimer"
            name="disclaimer"
            rows={2}
            value={formState.disclaimer}
            onChange={handleInputChange}
            className="p-3 border border-gray-300 rounded text-black font-normal bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"
          />
        </div>

        {/* Form Actions */}
        <div className="flex flex-wrap gap-2 pt-4">
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center justify-center gap-2 px-8 py-3 bg-gradient-to-r from-[#013D3B] via-[#0A6E6E] to-[#013D3B] text-white font-extrabold rounded shadow-lg hover:scale-105 hover:bg-blue-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="white" strokeWidth="2"/><path stroke="white" strokeWidth="2" d="M12 8v8M8 12h8"/></svg>
            {loading ? "Saving..." : (editingProduct ? "Update Product" : "Add Product")}
          </button>
          {editingProduct && (
            <button
              type="button"
              onClick={handleCancel}
              className="px-8 py-3 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 text-gray-700 font-extrabold rounded-2xl flex items-center justify-center gap-2 shadow-lg hover:scale-105 hover:bg-gray-500 transition-all duration-200"
            >
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24"><path stroke="#111827" strokeWidth="2" d="M6 6l12 12M6 18L18 6"/></svg>
              Cancel
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
import React from 'react';
import { getCategoryName } from '../utils/helpers.js';

const ProductsTable = ({
  products,
  categories,
  loading,
  handleEdit,
  handleDelete,
  handleToggleActive
}) => {
  return (
    <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-black">
          <thead className="text-left bg-gray-100">
            <tr>
              <th className="py-4 px-4 font-semibold">Image</th>
              <th className="py-4 px-4 font-semibold">Product Title</th>
              <th className="py-4 px-4 font-semibold">Category</th>
              <th className="py-4 px-4 font-semibold">Clicks</th>
              <th className="py-4 px-4 font-semibold">Status</th>
              <th className="py-4 px-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">Loading...</td>
              </tr>
            ) : products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200">
                  <td className="py-4 px-4">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-16 h-12 object-cover rounded-md border border-gray-200"
                    />
                  </td>
                  <td className="py-4 px-4">
                    <div className="font-semibold text-[#013D3B] truncate max-w-xs" title={product.title}>
                      {product.title}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Created: {new Date(product.created_at).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className="px-2 py-1 bg-[#013D3B] text-white text-xs rounded-full">
                      {getCategoryName(product.category, categories)}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-start">
                    <div className="font-semibold text-[#013D3B]">{product.total_clicks}</div>
                    <div className="text-xs text-gray-500">Total</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      product.is_active 
                        ? "bg-green-100 text-green-800" 
                        : "bg-red-100 text-red-800"
                    }`}>
                      {product.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex justify-center items-center space-x-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100 p-2 rounded-full shadow hover:scale-110 transition-all duration-200"
                        title="Edit"
                      >
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="#013D3B" strokeWidth="2" d="M4 20h4l10-10a2 2 0 0 0-2.83-2.83L5.17 17.17A2 2 0 0 0 4 20z"/></svg>
                      </button>
                      <button
                        onClick={() => handleToggleActive(product.id)}
                        className={`bg-gradient-to-r ${product.is_active ? "from-red-100 via-red-300 to-red-100" : "from-green-100 via-green-300 to-green-100"} p-2 rounded-full shadow hover:scale-110 transition-all duration-200`}
                        title={product.is_active ? "Deactivate" : "Activate"}
                      >
                        {product.is_active ? (
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#ef4444" strokeWidth="2"/><path stroke="#ef4444" strokeWidth="2" d="M8 12h8"/></svg>
                        ) : (
                          <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#22c55e" strokeWidth="2"/><path stroke="#22c55e" strokeWidth="2" d="M12 8v8M8 12h8"/></svg>
                        )}
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="bg-gradient-to-r from-red-100 via-red-300 to-red-100 p-2 rounded-full shadow hover:scale-110 transition-all duration-200"
                        title="Delete"
                      >
                        <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4" stroke="#ef4444" strokeWidth="2"/><path stroke="#ef4444" strokeWidth="2" d="M8 8l8 8M8 16L16 8"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-500">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">📦</div>
                    <div>No affiliate products found</div>
                    <div className="text-sm mt-1">Create your first product above!</div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductsTable;
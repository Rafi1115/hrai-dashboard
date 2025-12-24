import React from 'react';
import { MagnifyingGlassIcon, TrashIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const NotificationFilters = ({
  searchTerm,
  setSearchTerm,
  filterType,
  setFilterType,
  filterStatus,
  setFilterStatus,
  selectedNotifications,
  onBulkDelete
}) => {
  const handleBulkDelete = () => {
    if (selectedNotifications.length === 0) {
      toast.error("No notifications selected for deletion.", {
        duration: 3000,
        style: {
          background: "#EF4444",
          color: "white",
        },
      });
      return;
    }

    toast.promise(
      onBulkDelete(),
      {
        loading: "Deleting selected notifications...",
        success: "Selected notifications deleted successfully!",
        error: "Failed to delete selected notifications. Please try again.",
      },
      {
        style: {
          background: "#3B82F6",
          color: "white",
        },
      }
    );
  };

  return (
    <div className="backdrop-blur-lg rounded shadow-xl p-6 mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        
        {/* Search Input */}
        <div className="relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-3 border border-gray-400 rounded text-black font-normal min-w-[250px]"
          />
        </div>
        
        {/* Notification Type Filter */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-3 border border-gray-400 rounded text-black font-normal text-center mx-2"
        >
          <option value="all">All Types</option>
          <option value="push">Push</option>
          <option value="email">Email</option>
          <option value="in_app">In-App</option>
        </select>
        
        {/* Status Filter */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-3 border border-gray-400 rounded text-black font-normal text-center mx-2"
        >
          <option value="all">All Status</option>
          <option value="sent">Sent</option>
          <option value="pending">Pending</option>
          <option value="cancelled">Cancelled</option>
        </select>
        
        {/* Bulk Delete Button */}
        <button
          onClick={handleBulkDelete}
          disabled={selectedNotifications.length === 0}
          className={`flex items-center justify-center gap-2 px-6 py-3 rounded font-normal shadow-lg transition-all duration-200 mx-2 ${
            selectedNotifications.length > 0
              ? 'bg-gradient-to-r from-red-500 via-pink-500 to-red-500 text-white hover:scale-105 hover:from-red-600 hover:to-pink-600'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          <TrashIcon className="h-5 w-5" />
          Delete Selected ({selectedNotifications.length})
        </button>
      </div>
    </div>
  );
};

export default NotificationFilters;